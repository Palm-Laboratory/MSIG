"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { readJsonWithTtl, removeResultStorage, RESULT_STORAGE_KEYS, writeJsonWithTtl } from "@/lib/storage";
import { LIKERT_LABELS, SURVEY_GROUPS, SURVEY_PARTS, SURVEY_QUESTIONS, type PartId } from "@/lib/survey-data";

type Props = {
  part: PartId;
  partNumber: "1" | "2" | "3";
};

const AUTO_ADVANCE_DELAY_MS = 180;

const partNumbers: Record<PartId, "1" | "2" | "3"> = {
  "part-1": "1",
  "part-2": "2",
  "part-3": "3",
};

const routePartById: Record<PartId, string> = {
  "part-1": "1",
  "part-2": "2",
  "part-3": "3",
};

const ordinals = ["첫번째", "두번째", "세번째", "네번째", "다섯번째", "여섯번째", "일곱번째", "여덟번째"] as const;

const sectionNounByPart: Record<PartId, string> = {
  "part-1": "인물",
  "part-2": "위험 유형",
  "part-3": "행동 영역",
};

export function DiagnosisSurveyRunner({ part, partNumber }: Props) {
  const router = useRouter();
  const autoAdvanceTimer = useRef<number | null>(null);
  const partMeta = SURVEY_PARTS.find((item) => item.id === part) ?? SURVEY_PARTS[0];
  const questions = useMemo(() => SURVEY_QUESTIONS.filter((question) => question.part === part), [part]);
  const groups = useMemo(() => SURVEY_GROUPS.filter((group) => group.part === part), [part]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  const question = questions[currentIndex] ?? questions[0];
  const currentAnswer = question ? answers[String(question.id)] : undefined;
  const group = groups.find((item) => item.id === question?.groupId) ?? groups[0];
  const groupIndex = Math.max(
    0,
    groups.findIndex((item) => item.id === group?.id),
  );
  const displayIndex = currentIndex + 1;
  const progressWidth = `${Math.max(1, (displayIndex / partMeta.questionCount) * 100)}%`;
  const isLastQuestion = part === "part-3" && currentIndex === questions.length - 1;

  useEffect(() => {
    const loadedAnswers = readJsonWithTtl<Record<string, number>>(RESULT_STORAGE_KEYS.answers, {}, RESULT_STORAGE_KEYS.legacyAnswers);
    const storedIndex = readJsonWithTtl<Record<string, number>>(RESULT_STORAGE_KEYS.partIndex, {});
    const firstUnansweredIndex = questions.findIndex((item) => !loadedAnswers[String(item.id)]);
    const preferredIndex = storedIndex[part] ?? (firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0);

    setAnswers(loadedAnswers);
    setCurrentIndex(Math.min(Math.max(preferredIndex, 0), Math.max(questions.length - 1, 0)));
    setLoaded(true);
  }, [part, questions]);

  useEffect(() => {
    if (!loaded) return;
    writeJsonWithTtl(RESULT_STORAGE_KEYS.answers, answers);
  }, [answers, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const storedIndex = readJsonWithTtl<Record<string, number>>(RESULT_STORAGE_KEYS.partIndex, {});
    writeJsonWithTtl(RESULT_STORAGE_KEYS.partIndex, { ...storedIndex, [part]: currentIndex });
  }, [currentIndex, loaded, part]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        window.clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  const clearPendingAutoAdvance = () => {
    if (!autoAdvanceTimer.current) return;
    window.clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = null;
  };

  const goForwardFrom = (index: number) => {
    if (index < questions.length - 1) {
      setCurrentIndex(index + 1);
      return;
    }

    if (part === "part-1") router.push("/diagnosis/part/2");
    if (part === "part-2") router.push("/diagnosis/part/3");
    if (part === "part-3") router.push("/diagnosis/loading");
  };

  const selectAnswer = (value: number) => {
    if (!question) return;
    setMessage("");
    clearPendingAutoAdvance();

    setAnswers((current) => {
      const nextAnswers = { ...current, [question.id]: value };
      writeJsonWithTtl(RESULT_STORAGE_KEYS.answers, nextAnswers);
      return nextAnswers;
    });

    const selectedIndex = currentIndex;
    autoAdvanceTimer.current = window.setTimeout(() => {
      autoAdvanceTimer.current = null;
      goForwardFrom(selectedIndex);
    }, AUTO_ADVANCE_DELAY_MS);
  };

  const goPrevious = () => {
    clearPendingAutoAdvance();
    setMessage("");

    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
      return;
    }

    if (part === "part-1") {
      removeResultStorage();
      router.push("/diagnosis/info");
      return;
    }

    const previousPart = part === "part-2" ? "part-1" : "part-2";
    const previousPartQuestions = SURVEY_QUESTIONS.filter((item) => item.part === previousPart);
    const storedIndex = readJsonWithTtl<Record<string, number>>(RESULT_STORAGE_KEYS.partIndex, {});
    writeJsonWithTtl(RESULT_STORAGE_KEYS.partIndex, { ...storedIndex, [previousPart]: previousPartQuestions.length - 1 });
    router.push(`/diagnosis/part/${routePartById[previousPart]}`);
  };

  const goNext = () => {
    clearPendingAutoAdvance();

    if (!question || currentAnswer === undefined) {
      setMessage("문항에 응답한 뒤 다음으로 이동해 주세요.");
      return;
    }

    setMessage("");
    goForwardFrom(currentIndex);
  };

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#fffefe] font-sans text-[#1c1c19]">
      <div className="pointer-events-none absolute left-[-2.9375rem] top-[41.6875rem] h-[17.5rem] w-[17.5rem] rounded-full bg-[rgba(175,97,239,0.2)] opacity-25 blur-[2.5rem]" />
      <div className="pointer-events-none absolute left-[5.4375rem] top-[-3.375rem] h-[17.5rem] w-[17.5rem] rounded-full bg-[rgba(239,97,97,0.3)] opacity-25 blur-[2.5rem]" />
      <div className="pointer-events-none absolute left-[2.0625rem] top-[21.4375rem] h-[16.886rem] w-[37.5rem] rounded-full bg-[rgba(254,247,170,0.4)] opacity-25 blur-[2.5rem]" />

      <header className="relative z-10 flex w-full flex-col items-center bg-[rgba(255,255,255,0.7)] pb-3 pt-[env(safe-area-inset-top)] shadow-[0_1px_1px_rgba(28,28,25,0.05)] backdrop-blur-[0.75rem]">
        <div className="flex w-full items-center justify-between gap-4 px-6 pb-3 pt-4">
          <h1 className="text-[1rem] font-medium leading-none tracking-[-0.028rem]">
            PART {partNumber}. {partMeta.subtitle} ({partMeta.questionCount}문항)
          </h1>
          <span className="whitespace-nowrap text-[0.75rem] font-medium leading-none text-[#d47182]">
            {displayIndex} / {partMeta.questionCount}
          </span>
        </div>
        <div className="flex h-[0.375rem] w-[calc(100%-3rem)] overflow-hidden rounded-full bg-[#efdfdf]">
          <div className="h-full rounded-full bg-[#8c4752] transition-[width]" style={{ width: progressWidth }} />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-[80rem] flex-1 flex-col gap-10 px-6 pb-7 pt-12 md:px-8 lg:gap-[3.75rem] lg:px-0 lg:pb-8 lg:pt-[3.625rem]">
        <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-2.5 lg:mx-0 lg:ml-[19rem]">
          <p className="text-[0.75rem] font-medium uppercase leading-none tracking-[0.0875rem] text-[#b6737d]">
            {ordinals[groupIndex] ?? `${groupIndex + 1}번째`} {sectionNounByPart[part]}
          </p>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[1.5rem] font-bold leading-none tracking-[-0.0469rem] md:text-[2.25rem] md:leading-[2.35rem]">
              {group.name} - {group.subtitle}
            </h2>
            <p className="text-[1.25rem] font-medium leading-none tracking-[-0.0469rem] text-[rgba(28,28,25,0.8)]">({group.questionCount}문항)</p>
          </div>
        </div>

        <div className="relative">
          <article className="mx-auto flex w-full max-w-[42rem] flex-col gap-[1.625rem] rounded-lg border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.8)] px-5 py-10 shadow-[0_4px_6px_rgba(0,0,0,0.1)] md:px-9 lg:mx-0 lg:ml-[19rem]">
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-[0.75rem] font-medium leading-[1.375rem] text-[#8c4752]">{String(displayIndex).padStart(2, "0")}.</span>
              <h3 className="text-[1rem] font-medium leading-[1.625rem] text-[#1c1c19]">{question.label}</h3>
            </div>

            <div className="grid grid-cols-5 gap-0 rounded-lg border border-[rgba(0,0,0,0.04)] bg-[#fffdfd] px-1 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.1)] md:px-[1.9375rem] md:py-[1.0625rem]" role="radiogroup" aria-label={`${question.id}번 응답`}>
              {[1, 2, 3, 4, 5].map((value) => {
                const selected = currentAnswer === value;

                return (
                  <button
                    aria-checked={selected}
                    className={`flex h-12 min-w-0 flex-col items-center justify-center gap-2.5 rounded-md px-1 text-center transition hover:bg-[#fff7f7] ${
                      selected ? "!text-[#e55f5f]" : "!text-[#1c1c19]"
                    }`}
                    key={value}
                    onClick={() => selectAnswer(value)}
                    role="radio"
                    type="button"
                  >
                    <span
                      className={
                        selected
                          ? "grid size-4 place-items-center rounded-full border-[0.1875rem] border-[rgba(255,169,173,0.4)] bg-[#f27c7c]"
                          : "size-4 rounded-full border border-[#d6c2c3]"
                      }
                    >
                      {selected ? (
                        <svg aria-hidden="true" className="size-2" fill="none" viewBox="0 0 8 8">
                          <path d="M1.25 4.15 3.1 6 6.75 2" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                        </svg>
                      ) : null}
                    </span>
                    <span className="whitespace-nowrap text-[0.75rem] font-light leading-none tracking-[-0.01rem]">
                      {LIKERT_LABELS[value as keyof typeof LIKERT_LABELS]}
                    </span>
                  </button>
                );
              })}
            </div>

            <aside className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.04)] bg-[#fffdfd] px-[1.125rem] py-6 shadow-[0_4px_8px_rgba(0,0,0,0.1)] md:px-[1.875rem] md:py-8">
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-[rgba(140,71,82,0.05)] blur-[2rem]" />
              <div className="relative flex flex-col gap-[0.9375rem]">
                <div className="flex items-center gap-2">
                  <span className="grid size-3 place-items-center rounded-full border border-[#6d5750]">
                    <svg aria-hidden="true" className="h-[0.4375rem] w-[0.4375rem]" fill="none" viewBox="0 0 8 8">
                      <path d="M4 1.2v5.6M1.2 4h5.6" stroke="#6d5750" strokeLinecap="round" strokeWidth="1.1" />
                    </svg>
                  </span>
                  <strong className="text-[0.625rem] font-bold uppercase leading-none tracking-[0.075rem] text-[#6d5750]">RELATED VERSES</strong>
                </div>
                <p className="text-[0.75rem] font-medium leading-[1.375rem] text-[#6d5750]">"{question.scripture}"</p>
              </div>
            </aside>
          </article>

          <nav className="mt-10 flex justify-center lg:absolute lg:left-[69.25rem] lg:top-[5.375rem] lg:mt-0 lg:justify-start" aria-label="진단 파트 진행 상태">
            <ol className="flex items-center gap-5 lg:flex-col lg:items-stretch">
              {SURVEY_PARTS.map((item) => {
                const active = item.id === part;
                const completed = SURVEY_QUESTIONS.filter((surveyQuestion) => surveyQuestion.part === item.id).every((surveyQuestion) => answers[String(surveyQuestion.id)]);

                return (
                  <li className="flex items-center justify-end gap-[0.6875rem] lg:w-[8.625rem]" key={item.id}>
                    {active ? (
                      <>
                        <span className="whitespace-nowrap text-[0.75rem] font-medium uppercase leading-none tracking-[0.0875rem] text-[#b6737d] lg:text-[0.875rem] lg:leading-5">
                          PART {partNumbers[item.id]}.
                        </span>
                        <span className="h-px w-8 bg-[#b6737d]" />
                      </>
                    ) : null}
                    <span
                      className={
                        active || completed
                          ? "grid size-5 place-items-center rounded-full bg-[linear-gradient(148deg,#e57385_12.31%,#ff8c9e_80.77%)]"
                          : "size-5 rounded-full border border-[#d6c2c3]"
                      }
                    >
                      {completed ? (
                        <svg aria-hidden="true" className="size-3" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6.15 4.7 8.7 10 3.2" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                        </svg>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <div className="flex-1" />
      </section>

      <footer className="relative z-20 flex w-full flex-col gap-3 bg-[rgba(255,255,255,0.7)] px-6 pb-12 pt-3 shadow-[0_-1px_1px_rgba(28,28,25,0.05)] backdrop-blur-[0.75rem]">
        {message ? <p className="text-center text-[0.875rem] font-medium leading-5 text-[#a33d4c]">{message}</p> : null}
        <div className="mx-auto flex w-full max-w-[42rem] gap-5">
          <button
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded bg-[linear-gradient(143deg,#ffebeb_30.73%,#fff5f5_67%)] px-4 py-3 !text-[#524345] shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)] transition hover:-translate-y-0.5"
            onClick={goPrevious}
            type="button"
          >
            <svg aria-hidden="true" className="h-[0.8125rem] w-[0.875rem]" fill="none" viewBox="0 0 14 13">
              <path d="M8.6 2.1 4.2 6.5l4.4 4.4" stroke="#524345" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            <span className="text-[1rem] font-medium leading-6">이전</span>
          </button>
          <button
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded bg-[linear-gradient(156deg,#d47182_30.73%,#e68798_67%)] px-4 py-3 !text-white shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#e4e4e4] disabled:bg-none disabled:!text-[#a1a1a1] disabled:shadow-none disabled:hover:translate-y-0"
            disabled={currentAnswer === undefined}
            onClick={goNext}
            type="button"
          >
            <span className="text-[1rem] font-medium leading-6">{isLastQuestion ? "결과 분석하기" : "다음"}</span>
            <svg aria-hidden="true" className="h-[0.8125rem] w-[0.875rem]" fill="none" viewBox="0 0 14 13">
              <path d="m5.4 2.1 4.4 4.4-4.4 4.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
      </footer>
    </main>
  );
}
