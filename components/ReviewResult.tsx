"use client";

import { useState } from "react";

type Props = {
  text: string;
  streaming: boolean;
  maxLength: number;
};

export function ReviewResult({ text, streaming, maxLength }: Props) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;

  const visible = text.length;
  const min = Math.floor(maxLength * 0.9);
  const over = visible > maxLength;
  const tooShort = visible < min;

  return (
    <div className="rounded-apple border border-hairline bg-canvas p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-caption text-ink-48">
            {visible} / 최대 {maxLength}자
          </span>
          {!streaming && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                over
                  ? "bg-ink text-white"
                  : tooShort
                    ? "bg-canvas-parchment text-ink-80"
                    : "bg-action/10 text-action"
              }`}
            >
              {over ? "초과" : tooShort ? "부족" : "적정"}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-full border border-hairline px-4 py-1.5 text-caption text-ink hover:bg-canvas-parchment"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <div className="whitespace-pre-wrap text-body-apple text-ink">
        {text}
        {streaming && <span className="ml-0.5 inline-block animate-pulse text-action">▋</span>}
      </div>
    </div>
  );
}
