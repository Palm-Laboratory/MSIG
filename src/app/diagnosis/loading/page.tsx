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
    <main className="flex min-h-screen items-center justify-center bg-[#fff7f5] px-6 py-16">
      <section className="grid max-w-[560px] justify-items-center gap-5 rounded-lg border border-[#efdfdf] bg-[rgba(255,255,255,0.86)] p-8 text-center shadow-[0_14px_38px_rgba(140,71,82,0.09)]">
        <div className="relative h-20 w-20" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border border-[#e8667a] opacity-30" />
          <span className="absolute inset-3 animate-pulse rounded-full bg-[#fae8eb]" />
          <span className="absolute inset-7 rounded-full bg-[#e8667a]" />
        </div>
        <p className="text-[0.8125rem] font-black uppercase text-[#e8667a]">Analyzing</p>
        <h1 className="text-[1.625rem] font-extrabold leading-[1.2] text-[#423739] md:text-[2.5rem]">{hasAnswers ? "당신의 영성 데이터를 분석 중입니다." : "저장된 응답이 없습니다."}</h1>
        <p className="text-[0.9375rem] leading-[1.7] text-[#78716c] md:text-base">
          {hasAnswers ? "경제영성 지수, 경제유형, MSIG 행동 프로파일을 정리하는 중입니다." : "진단을 먼저 진행해 주세요."}
        </p>
        {!hasAnswers ? (
          <Link className="inline-flex min-h-[46px] items-center justify-center rounded-md bg-[#e8667a] px-[18px] font-extrabold text-white transition hover:-translate-y-px" href="/diagnosis/info">
            진단 시작하기
          </Link>
        ) : null}
      </section>
    </main>
  );
}
