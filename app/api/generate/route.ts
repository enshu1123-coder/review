import { NextRequest } from "next/server";
import { collectReviews } from "@/lib/naver";
import { analyze } from "@/lib/analyzer";
import { getGemini, MODEL } from "@/lib/gemini";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  brand?: string;
  product?: string;
  length?: number;
  rating?: number;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "유효하지 않은 JSON" }, { status: 400 });
  }

  const brand = (body.brand ?? "").trim();
  const product = (body.product ?? "").trim();
  const length = Number(body.length ?? 0);
  const rating = Number(body.rating ?? 0);

  if (!brand || !product) {
    return Response.json({ error: "브랜드와 제품명을 입력하세요." }, { status: 400 });
  }
  if (!Number.isFinite(length) || length < 50 || length > 3000) {
    return Response.json({ error: "글자 수는 50~3000 사이여야 합니다." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "별점은 1~5 사이 정수여야 합니다." }, { status: 400 });
  }

  let items;
  try {
    items = await collectReviews(brand, product);
  } catch (e) {
    return Response.json(
      { error: `리뷰 수집 실패: ${(e as Error).message}` },
      { status: 502 },
    );
  }

  const analysis = analyze(items);
  const userMessage = buildUserMessage({ brand, product, length, rating, analysis });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(
            `event: analysis\ndata: ${JSON.stringify(analysis)}\n\n`,
          ),
        );

        const ai = getGemini();
        const response = await ai.models.generateContentStream({
          model: MODEL,
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 8192,
            temperature: 0.9,
            thinkingConfig: { thinkingBudget: 0 },
          },
        });

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(
              encoder.encode(
                `event: token\ndata: ${JSON.stringify(text)}\n\n`,
              ),
            );
          }
        }

        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      } catch (e) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ message: (e as Error).message })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
