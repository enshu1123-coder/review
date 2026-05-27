"use client";

import { useState } from "react";
import { ReviewForm, type FormValues } from "@/components/ReviewForm";
import { ReviewResult } from "@/components/ReviewResult";
import { KeywordChips } from "@/components/KeywordChips";

function trimToSentence(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text.trim();
  const slice = text.slice(0, maxLen);
  // 우선순위: 종결어미+구두점 → 구두점 → 종결어미+공백 → 쉼표 → 공백
  const patterns = [
    /^[\s\S]*[다요네까][.!?]/,
    /^[\s\S]*[.!?。]/,
    /^[\s\S]*[다요네까][\s\n]/,
    /^[\s\S]*[,，]/,
    /^[\s\S]*\s/,
  ];
  const minAcceptable = maxLen * 0.5;
  for (const re of patterns) {
    const m = slice.match(re);
    if (m && m[0].length >= minAcceptable) {
      return m[0].trim();
    }
  }
  return slice.trim();
}

type Analysis = {
  topKeywords: { word: string; count: number }[];
  expressions: { phrase: string; count: number }[];
  avgSentenceLen: number;
  sampleCount: number;
};

export default function Page() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxLength, setMaxLength] = useState(300);

  async function handleSubmit(v: FormValues) {
    setText("");
    setAnalysis(null);
    setError(null);
    setStreaming(true);
    setMaxLength(v.length);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "알 수 없는 오류" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          const lines = block.split("\n");
          const event = lines.find((l) => l.startsWith("event: "))?.slice(7);
          const dataLine = lines.find((l) => l.startsWith("data: "))?.slice(6);
          if (!event || !dataLine) continue;
          const data = JSON.parse(dataLine);

          if (event === "analysis") setAnalysis(data);
          else if (event === "token") setText((prev) => prev + data);
          else if (event === "done") {
            setText((prev) => trimToSentence(prev, v.length));
          } else if (event === "error") throw new Error(data.message);
        }
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">맞춤형 리뷰 생성기</h1>
        <p className="mt-1 text-sm text-neutral-600">
          브랜드·제품·별점·글자 수를 입력하면, 실제 후기에서 추출한 패턴을 바탕으로 자연스러운 리뷰를 생성합니다.
        </p>
      </header>

      <div className="space-y-6">
        <ReviewForm onSubmit={handleSubmit} disabled={streaming} />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {analysis && (
          <KeywordChips
            keywords={analysis.topKeywords}
            expressions={analysis.expressions}
            sampleCount={analysis.sampleCount}
          />
        )}

        <ReviewResult text={text} streaming={streaming} maxLength={maxLength} />
      </div>
    </main>
  );
}
