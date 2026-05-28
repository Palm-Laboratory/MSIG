"use client";

import emailjs from "@emailjs/browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LottieAnimation } from "@/components/LottieAnimation";
import { formatEmailBodyFromStorage } from "@/lib/email";
import { readJsonWithTtl, RESULT_STORAGE_KEYS, type UserProfile } from "@/lib/storage";
import { SURVEY_QUESTIONS } from "@/lib/survey-data";

export default function DiagnosisLoadingPage() {
  const router = useRouter();
  const [hasAnswers, setHasAnswers] = useState(true);

  useEffect(() => {
    const answers = readJsonWithTtl<Record<string, number>>(RESULT_STORAGE_KEYS.answers, {}, RESULT_STORAGE_KEYS.legacyAnswers);
    const answered = SURVEY_QUESTIONS.filter((question) => answers[String(question.id)]).length;
    if (answered < SURVEY_QUESTIONS.length) {
      setHasAnswers(false);
      return;
    }

    const userProfile = readJsonWithTtl<UserProfile | null>(RESULT_STORAGE_KEYS.profile, null, RESULT_STORAGE_KEYS.legacyProfile);

    const sendResultEmail = async () => {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      if (!serviceId || !templateId || !publicKey) return;

      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            user_name: userProfile?.name ?? "(미입력)",
            user_phone: `나이: ${userProfile?.age ?? "-"} / 성별: ${userProfile?.gender ?? "-"} / 출석교회: ${userProfile?.church ?? "-"}`,
            privacy_consent: "동의",
            answers: formatEmailBodyFromStorage(userProfile ?? undefined),
          },
          { publicKey },
        );
      } catch (error) {
        console.error("[DiagnosisLoading] 결과 이메일 발송 실패:", error);
      }
    };

    void sendResultEmail();

    const timer = window.setTimeout(() => router.push("/diagnosis/result"), 3000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative flex h-dvh max-h-dvh overflow-hidden bg-white px-6 py-6 text-[#292524] md:items-center md:justify-center md:px-[30px]">
      <div className="pointer-events-none absolute -left-24 -top-24 size-[500px] rounded-full bg-[rgba(249,168,212,0.3)] opacity-25 blur-[40px]" />
      <div className="pointer-events-none absolute left-[71.3%] top-[355px] h-[270px] w-[600px] rounded-full bg-[rgba(254,215,170,0.4)] opacity-25 blur-[40px]" />

      <section className="relative z-10 mx-auto flex h-full w-full max-w-[760px] flex-col items-center justify-center gap-7 text-center">
        <LottieAnimation ariaLabel="진단 결과 검색 중" className="-mb-14 h-[180px] w-[252px] md:-mb-16 md:h-[220px] md:w-[308px]" path="/images/lottie/search_lottie.json" />

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center gap-8 pb-9 md:gap-10 md:pb-10">
            <h1 className="max-w-full text-[32px] font-bold leading-[1.22] tracking-normal text-[#292524] lg:whitespace-nowrap lg:text-[52px] lg:leading-10">
              {hasAnswers ? "당신의 영성 데이터를 분석 중입니다..." : "저장된 응답이 없습니다."}
            </h1>

            <div className="flex w-full max-w-[588px] flex-col items-center gap-4">
              <p className="text-[18px] font-medium leading-7 tracking-[0.45px] text-[#78716c] md:text-[20px]">
                {hasAnswers ? "성경적 경제관을 매칭하고 있습니다..." : "진단을 먼저 진행해 주세요."}
              </p>
              {hasAnswers ? (
                <>
                  <LottieAnimation ariaLabel="분석 진행 중" className="h-1 w-64 overflow-hidden rounded-full" path="/images/lottie/loading_bar_lottie.json?v=2" />
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
