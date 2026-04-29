"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LIKERT_LABELS, SURVEY_PARTS, SURVEY_QUESTIONS, type PartId } from "@/lib/survey-data";

type Props = {
  part: PartId;
};

const STORAGE_KEYS = {
  answers: "ges_answers",
  legacyAnswers: "msig.answers",
} as const;

const loadJson = <T,>(key: string, fallback: T, legacyKey?: string): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key) ?? (legacyKey ? window.localStorage.getItem(legacyKey) : null);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function SurveyRunner({ part }: Props) {
  const router = useRouter();
  const partMeta = SURVEY_PARTS.find((item) => item.id === part) ?? SURVEY_PARTS[0];
  const questions = useMemo(() => SURVEY_QUESTIONS.filter((question) => question.part === part), [part]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAnswers(loadJson<Record<string, number>>(STORAGE_KEYS.answers, {}, STORAGE_KEYS.legacyAnswers));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers));
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
    <main className="survey-shell">
      <header className="survey-header">
        <Link className="brand-mark" href="/diagnosis">
          MSIG
        </Link>
        <div className="survey-progress" aria-label={`전체 진행률 ${progress}%`}>
          <span>{partMeta.id}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <strong>{progress}%</strong>
        </div>
      </header>

      <section className="survey-intro">
        <p>
          {partMeta.questionRange[0]}-{partMeta.questionRange[1]} 문항
        </p>
        <h1>{partMeta.subtitle}</h1>
        <span>
          {part === "part-1"
            ? "복음경제영성의 기반이 되는 믿음, 활력, 지혜, 전략, 위험 감지, 일관성을 점검합니다."
            : part === "part-2"
              ? "경제 의사결정을 흔드는 반복 패턴과 위험 신호를 확인합니다."
              : "버는 행동, 쓰는 행동, 불리는 행동, 나누는 행동의 균형을 살핍니다."}
        </span>
      </section>

      <div className="question-groups">
        {Object.entries(grouped).map(([groupName, groupQuestions]) => (
          <section className="survey-card question-group" key={groupName}>
            <div className="group-title">
              <p className="section-kicker">{partMeta.id}</p>
              <h2>{groupName}</h2>
            </div>
            {groupQuestions.map((question) => (
              <article className="question-row" key={question.id}>
                <div className="question-copy">
                  <span>Q{question.id}</span>
                  <h3>{question.label}</h3>
                  <p>{question.scripture}</p>
                </div>
                <div className="scale-grid" role="radiogroup" aria-label={`${question.id}번 응답`}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      className={answers[String(question.id)] === value ? "scale-option selected" : "scale-option"}
                      key={value}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                      role="radio"
                      aria-checked={answers[String(question.id)] === value}
                      type="button"
                    >
                      <strong>{value}</strong>
                      <span>{LIKERT_LABELS[value as keyof typeof LIKERT_LABELS]}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>

      <footer className="survey-actions">
        <Link className="button ghost" href={part === "part-1" ? "/diagnosis/info" : part === "part-2" ? "/diagnosis/part/1" : "/diagnosis/part/2"}>
          이전
        </Link>
        <div>
          {message ? <p className="form-message">{message}</p> : null}
          <button className="button primary" onClick={onNext} type="button">
            {part === "part-3" ? "결과 분석하기" : "다음 파트"}
          </button>
        </div>
      </footer>
    </main>
  );
}
