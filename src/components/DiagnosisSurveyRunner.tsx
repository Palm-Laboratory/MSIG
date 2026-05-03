"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LIKERT_LABELS, SURVEY_GROUPS, SURVEY_PARTS, SURVEY_QUESTIONS, type PartId } from "@/lib/survey-data";

type Props = {
  part: PartId;
  partNumber: "1" | "2" | "3";
};

const STORAGE_KEYS = {
  answers: "ges_answers",
  legacyAnswers: "msig.answers",
  partIndex: "ges_part_index",
} as const;

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

const loadJson = <T,>(key: string, fallback: T, legacyKey?: string): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key) ?? (legacyKey ? window.localStorage.getItem(legacyKey) : null);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const clearSurveyStorage = () => {
  window.localStorage.removeItem(STORAGE_KEYS.answers);
  window.localStorage.removeItem(STORAGE_KEYS.legacyAnswers);
  window.localStorage.removeItem(STORAGE_KEYS.partIndex);
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

  useEffect(() => {
    const loadedAnswers = loadJson<Record<string, number>>(STORAGE_KEYS.answers, {}, STORAGE_KEYS.legacyAnswers);
    const storedIndex = loadJson<Record<string, number>>(STORAGE_KEYS.partIndex, {});
    const firstUnansweredIndex = questions.findIndex((item) => !loadedAnswers[String(item.id)]);
    const preferredIndex = storedIndex[part] ?? (firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0);

    setAnswers(loadedAnswers);
    setCurrentIndex(Math.min(Math.max(preferredIndex, 0), Math.max(questions.length - 1, 0)));
    setLoaded(true);
  }, [part, questions]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers));
  }, [answers, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const storedIndex = loadJson<Record<string, number>>(STORAGE_KEYS.partIndex, {});
    window.localStorage.setItem(STORAGE_KEYS.partIndex, JSON.stringify({ ...storedIndex, [part]: currentIndex }));
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
      window.localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(nextAnswers));
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
      clearSurveyStorage();
      router.push("/diagnosis/info");
      return;
    }

    const previousPart = part === "part-2" ? "part-1" : "part-2";
    const previousPartQuestions = SURVEY_QUESTIONS.filter((item) => item.part === previousPart);
    const storedIndex = loadJson<Record<string, number>>(STORAGE_KEYS.partIndex, {});
    window.localStorage.setItem(STORAGE_KEYS.partIndex, JSON.stringify({ ...storedIndex, [previousPart]: previousPartQuestions.length - 1 }));
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
    <main className="relative min-h-screen overflow-hidden bg-[#fffefe] font-sans text-[#1c1c19]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-[rgba(249,168,212,0.3)] opacity-25 blur-[40px]" />
      <div className="pointer-events-none absolute left-[57%] top-[355px] h-[270px] w-[600px] rounded-full bg-[rgba(254,215,170,0.4)] opacity-25 blur-[40px]" />

      <header className="relative z-10 flex w-full flex-col items-center bg-[rgba(255,249,250,0.8)] pb-2 shadow-[0_1px_1px_rgba(28,28,25,0.05)] backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-4 px-5 py-4 md:px-6">
          <h1 className="text-[16px] font-medium leading-7 tracking-[-0.025em] md:text-[18px]">
            PART {partNumber}. {partMeta.subtitle} ({partMeta.questionCount}문항)
          </h1>
          <span className="whitespace-nowrap text-[16px] font-medium leading-none text-[#d47182]">
            {displayIndex} / {partMeta.questionCount}
          </span>
        </div>
        <div className="flex h-[6px] w-[calc(100%-40px)] items-start gap-1 md:w-[calc(100%-48px)]">
          <div className="h-full rounded-full bg-[#8c4752] transition-[width]" style={{ width: progressWidth }} />
          <div className="h-full flex-1 rounded-full bg-[#efdfdf]" />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-[46px] px-5 pb-8 pt-[54px] md:px-8 md:pt-[58px] lg:gap-[60px] lg:px-0 lg:pb-5">
        <div className="mx-auto flex w-full max-w-[672px] flex-col gap-2.5 lg:mx-0 lg:ml-[304px]">
          <p className="text-[14px] font-medium uppercase leading-5 tracking-[0.1em] text-[#b6737d]">
            {ordinals[groupIndex] ?? `${groupIndex + 1}번째`} {sectionNounByPart[part]}
          </p>
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.021em] md:text-[36px] md:leading-[37.5px]">
            {group.name} - {group.subtitle} ({group.questionCount}문항)
          </h2>
        </div>

        <div className="relative">
          <article className="mx-auto flex w-full max-w-[672px] flex-col gap-10 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.8)] px-5 py-8 shadow-[0_4px_6px_rgba(0,0,0,0.1)] md:gap-12 md:px-9 md:py-10 lg:mx-0 lg:ml-[304px]">
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-[18px] font-medium leading-7 text-[#8c4752]">{String(question.id).padStart(2, "0")}.</span>
              <h3 className="text-[18px] font-medium leading-8 md:text-[20px]">{question.label}</h3>
            </div>

            <div className="grid gap-3 rounded-lg border border-[rgba(0,0,0,0.04)] bg-[#fffdfd] px-4 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.1)] min-[720px]:grid-cols-5 min-[720px]:gap-0 min-[720px]:px-[31px] min-[720px]:py-[17px]" role="radiogroup" aria-label={`${question.id}번 응답`}>
              {[1, 2, 3, 4, 5].map((value) => {
                const selected = currentAnswer === value;

                return (
                  <button
                    aria-checked={selected}
                    className="flex min-h-12 items-center gap-3 rounded-md px-2 text-left transition hover:bg-[#fff7f7] min-[720px]:flex-col min-[720px]:justify-center min-[720px]:gap-1 min-[720px]:px-0 min-[720px]:text-center"
                    key={value}
                    onClick={() => selectAnswer(value)}
                    role="radio"
                    type="button"
                  >
                    <span
                      className={
                        selected
                          ? "grid size-5 place-items-center rounded-full border-4 border-[rgba(255,169,173,0.4)] bg-[#f27c7c] text-[11px] font-bold leading-none text-white"
                          : "size-5 rounded-full border border-[#d6c2c3]"
                      }
                    >
                      {selected ? "✓" : null}
                    </span>
                    <span className={selected ? "text-[16px] font-medium leading-6 text-[#e55f5f]" : "text-[16px] font-light leading-6 text-[#1c1c19]"}>
                      {LIKERT_LABELS[value as keyof typeof LIKERT_LABELS]}
                    </span>
                  </button>
                );
              })}
            </div>

            <aside className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.04)] bg-[#fffdfd] px-[30px] py-8 shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-[rgba(140,71,82,0.05)] blur-[32px]" />
              <div className="relative flex flex-col gap-[15px]">
                <div className="flex items-center gap-2">
                  <span className="grid size-3 place-items-center rounded-full border border-[#6d5750] text-[8px] font-bold leading-none text-[#6d5750]">i</span>
                  <strong className="text-[12px] font-bold uppercase leading-4 tracking-[0.1em] text-[#6d5750]">RELATED VERSES</strong>
                </div>
                <p className="text-[14px] font-medium leading-[22.75px] text-[#6d5750]">{question.scripture}</p>
              </div>
            </aside>
          </article>

          <nav className="hidden lg:absolute lg:left-[1108px] lg:top-[86px] lg:mt-0 lg:flex lg:justify-start" aria-label="진단 파트 진행 상태">
            <ol className="flex flex-col items-stretch gap-5">
              {SURVEY_PARTS.map((item) => {
                const active = item.id === part;
                const completed = SURVEY_QUESTIONS.filter((surveyQuestion) => surveyQuestion.part === item.id).every((surveyQuestion) => answers[String(surveyQuestion.id)]);

                return (
                  <li className="flex w-[138px] items-center justify-end gap-[11px]" key={item.id}>
                    <span className={active ? "whitespace-nowrap text-[14px] font-medium uppercase leading-5 tracking-[0.1em] text-[#b6737d]" : "whitespace-nowrap text-[14px] font-medium uppercase leading-5 tracking-[0.1em] text-[#d6c2c3]"}>
                      PART {partNumbers[item.id]}.
                    </span>
                    <span className={active || completed ? "h-px w-8 bg-[#b6737d]" : "h-px w-8 bg-[#d6c2c3]"} />
                    <span
                      className={
                        active || completed
                          ? "grid size-5 place-items-center rounded-full bg-[linear-gradient(148deg,#e57385_12.31%,#ff8c9e_80.77%)] text-[11px] font-bold leading-none text-white"
                          : "size-5 rounded-full border border-[#d6c2c3]"
                      }
                    >
                      {completed ? "✓" : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <footer className="mx-auto flex w-full max-w-[672px] flex-col gap-3 border-t border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.7)] pt-6 backdrop-blur-xl lg:mx-0 lg:ml-[304px]">
          {message ? <p className="text-center text-[14px] font-medium leading-5 text-[#a33d4c]">{message}</p> : null}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <button className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded bg-[linear-gradient(156deg,#ffebeb_30.73%,#fff5f5_67%)] text-[16px] font-medium text-[#524345] shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)] transition hover:-translate-y-0.5" onClick={goPrevious} type="button">
              <span aria-hidden="true">←</span>
              이전
            </button>
            <button
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded bg-[linear-gradient(156deg,#d47182_30.73%,#e68798_67%)] text-[16px] font-medium text-white shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#d6c2c3] disabled:bg-none disabled:text-white/80 disabled:shadow-none disabled:hover:translate-y-0"
              disabled={currentAnswer === undefined}
              onClick={goNext}
              type="button"
            >
              {part === "part-3" && currentIndex === questions.length - 1 ? "결과 분석하기" : "다음"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
