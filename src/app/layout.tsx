import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSIG 복음경제영성 진단",
  description: "성경적 경제영성 관점에서 재정 태도와 행동 프로파일을 진단합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
