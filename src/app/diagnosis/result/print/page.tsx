import type { Metadata } from "next";
import { ResultPrintView } from "@/components/ResultPrintView";

export const metadata: Metadata = {
  title: "진단 결과 인쇄",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DiagnosisResultPrintPage() {
  return <ResultPrintView />;
}
