export type ReviewItem = {
  source: "blog" | "shop";
  title: string;
  snippet: string;
};

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();

async function searchOne(
  kind: "blog" | "shop",
  query: string,
): Promise<ReviewItem[]> {
  const id = process.env.NAVER_CLIENT_ID;
  const secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret) throw new Error("NAVER_CLIENT_ID/SECRET 환경변수가 없습니다.");

  const url = `https://openapi.naver.com/v1/search/${kind}.json?query=${encodeURIComponent(
    query,
  )}&display=30&sort=sim`;

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": id,
      "X-Naver-Client-Secret": secret,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Naver ${kind} ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as { items?: Array<{ title: string; description: string }> };
  return (data.items ?? []).map((it) => ({
    source: kind,
    title: stripHtml(it.title),
    snippet: stripHtml(it.description),
  }));
}

export async function collectReviews(brand: string, product: string): Promise<ReviewItem[]> {
  const q = `${brand} ${product}`.trim();
  const [blogs, shops] = await Promise.allSettled([searchOne("blog", q), searchOne("shop", q)]);
  const out: ReviewItem[] = [];
  if (blogs.status === "fulfilled") out.push(...blogs.value);
  if (shops.status === "fulfilled") out.push(...shops.value);
  return out;
}
