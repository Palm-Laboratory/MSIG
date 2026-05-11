import type { Metadata } from "next";
import { ResultView } from "@/components/ResultView";

export const metadata: Metadata = {
  title: "진단 결과",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DiagnosisResultPage() {
  return <ResultView />;
}
