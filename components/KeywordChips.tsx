"use client";

type Props = {
  keywords: { word: string; count: number }[];
  expressions: { phrase: string; count: number }[];
  sampleCount: number;
};

export function KeywordChips({ keywords, expressions, sampleCount }: Props) {
  if (sampleCount === 0) return null;
  return (
    <div className="rounded-apple bg-canvas-parchment p-8">
      <div className="mb-5 text-caption text-ink-48">
        실제 후기 {sampleCount}건에서 추출한 패턴
      </div>

      <div className="mb-6">
        <div className="mb-3 text-caption-strong text-ink-80">빈출 키워드</div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span
              key={k.word}
              className="rounded-full bg-canvas px-3 py-1.5 text-caption text-ink"
            >
              {k.word}
              <span className="ml-1 text-ink-48">×{k.count}</span>
            </span>
          ))}
        </div>
      </div>

      {expressions.length > 0 && (
        <div>
          <div className="mb-3 text-caption-strong text-ink-80">빈출 표현</div>
          <div className="flex flex-wrap gap-2">
            {expressions.map((e) => (
              <span
                key={e.phrase}
                className="rounded-full bg-canvas px-3 py-1.5 text-caption text-ink"
              >
                {e.phrase}
                <span className="ml-1 text-ink-48">×{e.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
