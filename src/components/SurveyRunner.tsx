"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { readJsonWithTtl, RESULT_STORAGE_KEYS, writeJsonWithTtl } from "@/lib/storage";
import { LIKERT_LABELS, SURVEY_PARTS, SURVEY_QUESTIONS, type PartId } from "@/lib/survey-data";

type Props = {
  part: PartId;
};

export function SurveyRunner({ part }: Props) {
  const router = useRouter();
  const partMeta = SURVEY_PARTS.find((item) => item.id === part) ?? SURVEY_PARTS[0];
  const questions = useMemo(() => SURVEY_QUESTIONS.filter((question) => question.part === part), [part]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAnswers(readJsonWithTtl<Record<string, number>>(RESULT_STORAGE_KEYS.answers, {}, RESULT_STORAGE_KEYS.legacyAnswers));
  }, []);

  useEffect(() => {
    writeJsonWithTtl(RESULT_STORAGE_KEYS.answers, answers);
  }, [answers]);

  const answeredInPart = questions.filter((question) => answers[String(question.id)]).length;
  const overallAnswered = SURVEY_QUESTIONS.filter((question) => answers[String(question.id)]).length;
  const progress = Math.round((overallAnswered / SURVEY_QUESTIONS.length) * 100);
  const canContinue = answeredInPart === questions.length;

  const grouped = questions.reduce<Record<string, typeof questions>>((acc, question) => {
    acc[question.groupName] = [...(acc[question.groupName] ?? []), question];
    return acc;
  }, {});

  const onNext = () => {
    if (!canContinue) {
      setMessage("현재 파트의 모든 문항에 응답해 주세요.");
      return;
    }
    setMessage("");
    if (part === "part-1") router.push("/diagnosis/part/2");
    if (part === "part-2") router.push("/diagnosis/part/3");
    if (part === "part-3") router.push("/diagnosis/loading");
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-[1080px] gap-6 bg-[#fff7f5] px-6 py-8 text-[#1c1c19]">
      <header className="flex items-center justify-between gap-4 max-[640px]:flex-col max-[640px]:items-stretch">
        <Link className="inline-flex h-10 min-w-[74px] items-center justify-center rounded-md bg-[#423739] px-3.5 font-black text-[#fff7f5]" href="/diagnosis">
          MSBF
        </Link>
        <div className="grid min-w-[260px] grid-cols-[auto_1fr_auto] items-center gap-3 text-[0.8125rem] font-black text-[#423739] max-[640px]:grid-cols-[1fr_auto]" aria-label={`전체 진행률 ${progress}%`}>
          <span>{partMeta.id}</span>
          <div className="h-2 overflow-hidden rounded-full bg-[#f1dedb] max-[640px]:col-span-2 max-[640px]:row-start-2">
            <div className="h-full rounded-full bg-[#e8667a]" style={{ width: `${progress}%` }} />
          </div>
          <strong>{progress}%</strong>
        </div>
      </header>

      <section className="grid gap-3 py-5">
        <p className="text-[0.8125rem] font-black uppercase text-[#e8667a]">
          {partMeta.questionRange[0]}-{partMeta.questionRange[1]} 문항
        </p>
        <h1 className="text-[1.625rem] font-extrabold leading-[1.2] text-[#423739] md:text-[2.5rem]">{partMeta.subtitle}</h1>
        <span className="max-w-[760px] text-[0.9375rem] leading-[1.7] text-[#78716c] md:text-base">
          {part === "part-1"
            ? "복음경제영성의 기반이 되는 믿음, 활력, 지혜, 전략, 위험 감지, 일관성을 점검합니다."
            : part === "part-2"
              ? "경제 의사결정을 흔드는 반복 패턴과 위험 신호를 확인합니다."
              : "부르심, 청지기 사명, 세움과 성장, 흘려보냄의 균형을 살핍니다."}
        </span>
      </section>

      <div className="grid gap-5">
        {Object.entries(grouped).map(([groupName, groupQuestions]) => (
          <section className="grid gap-5 rounded-lg border border-[#efdfdf] bg-[rgba(255,255,255,0.86)] p-6 shadow-[0_14px_38px_rgba(140,71,82,0.09)]" key={groupName}>
            <div className="grid gap-1">
              <p className="text-[0.8125rem] font-black uppercase text-[#e8667a]">{partMeta.id}</p>
              <h2 className="text-[1.375rem] font-bold leading-[1.3] text-[#423739] md:text-[1.875rem]">{groupName}</h2>
            </div>
            {groupQuestions.map((question) => (
              <article className="grid grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)] gap-5 border-t border-[#efdfdf] pt-5 max-lg:grid-cols-1" key={question.id}>
                <div className="grid gap-2">
                  <span className="text-[0.8125rem] font-black text-[#e8667a]">Q{question.id}</span>
                  <h3 className="text-[1.125rem] font-semibold leading-[1.4] text-[#30292a] md:text-[1.375rem]">{question.label}</h3>
                  <p className="text-sm leading-[1.6] text-[#78716c]">{question.scripture}</p>
                </div>
                <div className="grid grid-cols-5 gap-2 max-[640px]:grid-cols-1" role="radiogroup" aria-label={`${question.id}번 응답`}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      className={`grid min-h-[76px] justify-items-center gap-1 rounded-md border bg-[#fffefe] p-3 text-center transition max-[640px]:min-h-[52px] max-[640px]:grid-cols-[32px_1fr] max-[640px]:items-center max-[640px]:justify-items-start max-[640px]:text-left ${
                        answers[String(question.id)] === value ? "border-[#e8667a] text-[#423739] shadow-[0_0_0_2px_rgba(232,102,122,0.16)]" : "border-[#efdfdf] text-[#78716c]"
                      }`}
                      key={value}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                      role="radio"
                      aria-checked={answers[String(question.id)] === value}
                      type="button"
                    >
                      <strong className="text-[1.08rem] font-black">{value}</strong>
                      <span className="text-[0.72rem] leading-[1.25]">{LIKERT_LABELS[value as keyof typeof LIKERT_LABELS]}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>

      <footer className="flex items-center justify-between gap-3 pb-8 max-[640px]:flex-col max-[640px]:items-stretch">
        <Link className="inline-flex min-h-[46px] items-center justify-center rounded-md border border-[#efdfdf] bg-[rgba(255,255,255,0.66)] px-[18px] font-extrabold text-[#423739] transition hover:-translate-y-px" href={part === "part-1" ? "/diagnosis/info" : part === "part-2" ? "/diagnosis/part/1" : "/diagnosis/part/2"}>
          이전
        </Link>
        <div className="grid justify-items-end gap-2 max-[640px]:justify-items-stretch">
          {message ? <p className="text-sm font-semibold text-[#a33d4c]">{message}</p> : null}
          <button className="inline-flex min-h-[46px] items-center justify-center rounded-md bg-[#e8667a] px-[18px] font-extrabold text-white transition hover:-translate-y-px" onClick={onNext} type="button">
            {part === "part-3" ? "결과 분석하기" : "다음 파트"}
          </button>
        </div>
      </footer>
    </main>
  );
}
