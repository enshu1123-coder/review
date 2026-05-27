import type { ReviewItem } from "./naver";

const STOPWORDS = new Set([
  "그리고", "하지만", "그래서", "그러나", "정말", "진짜", "너무", "아주", "매우",
  "그냥", "조금", "약간", "이거", "저거", "그거", "이건", "저건", "그건",
  "있어요", "있습니다", "없어요", "없습니다", "입니다", "이에요", "예요",
  "합니다", "해요", "했어요", "했습니다", "하는", "되는", "되어", "되서",
  "에서", "에게", "으로", "으로서", "에는", "에도", "까지", "부터", "보다",
  "제품", "상품", "구매", "사용", "리뷰", "후기",
]);

const ENDING_PATTERNS = [
  /좋아요|좋습니다|좋네요/g,
  /추천(합니다|해요|드려요)/g,
  /재구매(\s?의사)?/g,
  /만족(스럽|합니다|해요)/g,
  /별로(에요|입니다)?/g,
  /아쉽(네요|습니다|어요)/g,
  /가성비/g,
  /빠른\s?배송/g,
  /후회(없|없는|없어요)/g,
  /선물(용|로|하기)/g,
];

export type Analysis = {
  topKeywords: { word: string; count: number }[];
  expressions: { phrase: string; count: number }[];
  avgSentenceLen: number;
  sampleCount: number;
};

export function analyze(items: ReviewItem[]): Analysis {
  const text = items.map((i) => `${i.title} ${i.snippet}`).join(" ");

  // 2~6음절 한글 토큰
  const tokens = text.match(/[가-힣]{2,6}/g) ?? [];
  const freq = new Map<string, number>();
  for (const t of tokens) {
    if (STOPWORDS.has(t)) continue;
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  const topKeywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  const expressions: { phrase: string; count: number }[] = [];
  for (const re of ENDING_PATTERNS) {
    const matches = text.match(re);
    if (matches && matches.length > 0) {
      expressions.push({ phrase: matches[0], count: matches.length });
    }
  }
  expressions.sort((a, b) => b.count - a.count);

  const sentences = text.split(/[.!?。\n]+/).filter((s) => s.trim().length > 4);
  const avgSentenceLen =
    sentences.length > 0
      ? Math.round(sentences.reduce((acc, s) => acc + s.trim().length, 0) / sentences.length)
      : 40;

  return {
    topKeywords,
    expressions: expressions.slice(0, 10),
    avgSentenceLen,
    sampleCount: items.length,
  };
}
