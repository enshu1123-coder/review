import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리뷰 생성기",
  description: "브랜드/제품/별점/글자 수를 입력해 자연스러운 리뷰를 생성합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">{children}</body>
    </html>
  );
}
