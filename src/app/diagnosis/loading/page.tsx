"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LottieAnimation } from "@/components/LottieAnimation";
import { SURVEY_QUESTIONS } from "@/lib/survey-data";

const STORAGE_KEY = "ges_answers";
const HOLD_LOADING_IN_DEVELOPMENT = process.env.NODE_ENV === "development";

export default function DiagnosisLoadingPage() {
  const router = useRouter();
  const [hasAnswers, setHasAnswers] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const answers = stored ? (JSON.parse(stored) as Record<string, number>) : {};
    const answered = SURVEY_QUESTIONS.filter((question) => answers[String(question.id)]).length;
    if (answered === 0) {
      if (HOLD_LOADING_IN_DEVELOPMENT) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ [SURVEY_QUESTIONS[0].id]: 3 }));
        setHasAnswers(true);
        return;
      }

      setHasAnswers(false);
      return;
    }
    if (HOLD_LOADING_IN_DEVELOPMENT) return;

    const timer = window.setTimeout(() => router.push("/diagnosis/result"), 3000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-white px-6 py-20 text-[#292524] md:items-start md:justify-center md:px-[30px] md:py-[100px]">
      <div className="pointer-events-none absolute -left-24 -top-24 size-[500px] rounded-full bg-[rgba(249,168,212,0.3)] opacity-25 blur-[40px]" />
      <div className="pointer-events-none absolute left-[71.3%] top-[355px] h-[270px] w-[600px] rounded-full bg-[rgba(254,215,170,0.4)] opacity-25 blur-[40px]" />

      <section className="relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center justify-center gap-[60px] text-center md:py-20">
        <LottieAnimation ariaLabel="진단 결과 검색 중" className="-mb-20 h-[250px] w-[350px]" path="/images/lottie/search_lottie.json" />

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center gap-[52px] pb-16">
            <h1 className="max-w-full text-[32px] font-bold leading-[1.22] tracking-normal text-[#292524] lg:whitespace-nowrap lg:text-[52px] lg:leading-10">
              {hasAnswers ? "당신의 영성 데이터를 분석 중입니다..." : "저장된 응답이 없습니다."}
            </h1>

            <div className="flex w-full max-w-[588px] flex-col items-center gap-4">
              <p className="text-[18px] font-medium leading-7 tracking-[0.45px] text-[#78716c] md:text-[20px]">
                {hasAnswers ? "성경적 경제관을 매칭하고 있습니다..." : "진단을 먼저 진행해 주세요."}
              </p>
              {hasAnswers ? (
                <>
                  <div className="h-1 w-64 overflow-hidden rounded-full bg-[#e7e5e4]">
                    <div className="h-full w-full animate-pulse rounded-full bg-[linear-gradient(90deg,rgba(193,133,144,0)_0%,#c18590_50%,rgba(193,133,144,0)_100%)]" />
                  </div>
                  <p className="text-[16px] font-medium leading-5 text-[#a8a29e]">진실한 청지기적 가치를 탐색하고 있습니다.</p>
                </>
              ) : (
                <Link className="inline-flex min-h-[46px] items-center justify-center rounded bg-[#c18590] px-5 font-bold text-white transition hover:-translate-y-px hover:bg-[#a96d78]" href="/diagnosis/info">
                  진단 시작하기
                </Link>
              )}
            </div>
          </div>

          <figure className="flex h-[150px] w-full max-w-[512px] flex-col items-center justify-center gap-6 rounded-lg border border-[rgba(193,133,144,0.6)] bg-white px-6 py-px shadow-[0_1px_2px_rgba(0,0,0,0.05)] md:px-[41px]">
            <blockquote className="text-center text-[18px] font-medium leading-8 text-[#292524] md:text-[20px]">
              &quot;네 보물 있는 그 곳에는 네 마음도 있느니라&quot;
            </blockquote>
            <figcaption className="text-center text-[15px] font-medium uppercase leading-4 tracking-[1.2px] text-[#c18590] md:text-[16px]">
              - 마태복음 6:21
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
