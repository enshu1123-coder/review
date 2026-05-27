import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리뷰 생성기",
  description: "브랜드와 제품을 입력하면 실제 후기 패턴을 바탕으로 자연스러운 리뷰를 생성합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-canvas text-ink">{children}</body>
    </html>
  );
}
