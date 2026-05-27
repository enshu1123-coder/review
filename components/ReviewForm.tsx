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
      className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">브랜드</label>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="예: 삼다수"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">제품명</label>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="예: 2L 생수"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">최대 글자 수</label>
          <input
            type="number"
            min={50}
            max={3000}
            step={1}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <p className="mt-1 text-xs text-neutral-500">이 값을 절대 넘지 않습니다 (50~3000)</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">별점</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-2xl transition ${
                  n <= rating ? "text-yellow-400" : "text-neutral-300"
                }`}
                aria-label={`${n}점`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 self-center text-sm text-neutral-500">{rating}/5</span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {disabled ? "생성 중..." : "리뷰 생성"}
      </button>
    </form>
  );
}
