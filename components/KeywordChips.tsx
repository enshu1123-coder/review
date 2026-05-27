"use client";

type Props = {
  keywords: { word: string; count: number }[];
  expressions: { phrase: string; count: number }[];
  sampleCount: number;
};

export function KeywordChips({ keywords, expressions, sampleCount }: Props) {
  if (sampleCount === 0) return null;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
      <div className="mb-2 text-neutral-500">
        실제 후기 {sampleCount}건에서 추출한 패턴
      </div>
      <div className="mb-3">
        <div className="mb-1 text-xs font-medium text-neutral-600">빈출 키워드</div>
        <div className="flex flex-wrap gap-1">
          {keywords.map((k) => (
            <span
              key={k.word}
              className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
            >
              {k.word} <span className="text-blue-400">×{k.count}</span>
            </span>
          ))}
        </div>
      </div>
      {expressions.length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-neutral-600">빈출 표현</div>
          <div className="flex flex-wrap gap-1">
            {expressions.map((e) => (
              <span
                key={e.phrase}
                className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
              >
                {e.phrase} <span className="text-amber-400">×{e.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
