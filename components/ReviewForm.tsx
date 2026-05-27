"use client";

import { useState } from "react";

export type FormValues = {
  brand: string;
  product: string;
  length: number;
  rating: number;
};

type Props = {
  onSubmit: (v: FormValues) => void;
  disabled?: boolean;
};

export function ReviewForm({ onSubmit, disabled }: Props) {
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [length, setLength] = useState(300);
  const [rating, setRating] = useState(5);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!brand.trim() || !product.trim()) return;
        onSubmit({ brand: brand.trim(), product: product.trim(), length, rating });
      }}
      className="rounded-apple border border-hairline bg-canvas p-8"
    >
      <div className="space-y-6">
        <Field label="브랜드">
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="예: 제니퍼룸"
            className="w-full bg-transparent text-body-apple text-ink outline-none placeholder:text-ink-48"
            required
          />
        </Field>

        <Field label="제품명">
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="예: BLDC 스탠딩 헤어드라이기 프로"
            className="w-full bg-transparent text-body-apple text-ink outline-none placeholder:text-ink-48"
            required
          />
        </Field>

        <Field label="최대 글자 수">
          <input
            type="number"
            min={50}
            max={3000}
            step={1}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full bg-transparent text-body-apple text-ink outline-none"
            required
          />
          <div className="mt-1 text-caption text-ink-48">50~3000자 이내, 이 값을 넘지 않습니다</div>
        </Field>

        <div>
          <div className="mb-3 text-caption-strong text-ink-80">별점</div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-[28px] leading-none ${
                  n <= rating ? "text-ink" : "text-hairline"
                }`}
                aria-label={`${n}점`}
              >
                ★
              </button>
            ))}
            <span className="ml-3 text-caption text-ink-48">{rating} / 5</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="mt-8 w-full rounded-full bg-action px-6 py-3 text-body-apple text-white disabled:bg-ink-48"
      >
        {disabled ? "생성 중..." : "리뷰 생성"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-hairline-soft pb-3">
      <div className="mb-2 text-caption-strong text-ink-80">{label}</div>
      {children}
    </div>
  );
}
