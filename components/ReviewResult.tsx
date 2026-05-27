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
  const status = over ? "초과" : tooShort ? "부족" : "적정";
  const statusClass = over
    ? "bg-red-100 text-red-700"
    : tooShort
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          {visible}자 / 최대 {maxLength}자 (권장 {min}~{maxLength})
          {!streaming && (
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${statusClass}`}>
              {status}
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
          className="rounded-md border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-100"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
        {text}
        {streaming && <span className="animate-pulse">▋</span>}
      </div>
    </div>
  );
}
