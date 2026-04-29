"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SURVEY_QUESTIONS } from "@/lib/survey-data";

const STORAGE_KEY = "ges_answers";

export default function DiagnosisLoadingPage() {
  const router = useRouter();
  const [hasAnswers, setHasAnswers] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const answers = stored ? (JSON.parse(stored) as Record<string, number>) : {};
    const answered = SURVEY_QUESTIONS.filter((question) => answers[String(question.id)]).length;
    if (answered === 0) {
      setHasAnswers(false);
      return;
    }
    const timer = window.setTimeout(() => router.push("/diagnosis/result"), 3000);
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
        <h1>{hasAnswers ? "당신의 영성 데이터를 분석 중입니다." : "저장된 응답이 없습니다."}</h1>
        <p>{hasAnswers ? "경제영성 지수, 경제유형, MSIG 행동 프로파일을 정리하는 중입니다." : "진단을 먼저 진행해 주세요."}</p>
        {!hasAnswers ? (
          <Link className="button primary" href="/diagnosis/info">
            진단 시작하기
          </Link>
        ) : null}
      </section>
    </main>
  );
}
