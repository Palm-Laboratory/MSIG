import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "진단 결과 분석 중",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DiagnosisLoadingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
