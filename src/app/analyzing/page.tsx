"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SURVEY_QUESTIONS } from "@/lib/survey-data";

const STORAGE_KEYS = {
  answers: "msig.answers",
} as const;

export default function AnalyzingPage() {
  const router = useRouter();
  const [hasAnswers, setHasAnswers] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.answers);
    const answers = stored ? (JSON.parse(stored) as Record<string, number>) : {};
    const answered = SURVEY_QUESTIONS.filter((question) => answers[String(question.id)]).length;
    if (answered === 0) {
      setHasAnswers(false);
      return;
    }
    const timer = window.setTimeout(() => router.push("/result"), 1800);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="analysis-shell">
      <section className="analysis-card">
        <div className="analysis-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="section-kicker">Analyzing</p>
        <h1>{hasAnswers ? "응답을 분석하고 있습니다." : "저장된 응답이 없습니다."}</h1>
        <p>{hasAnswers ? "경제영성 지수, 경제유형, MSIG 행동 프로파일을 정리하는 중입니다." : "진단을 먼저 진행해 주세요."}</p>
        {!hasAnswers ? (
          <Link className="button primary" href="/survey/part-1">
            진단 시작하기
          </Link>
        ) : null}
      </section>
    </main>
  );
}
