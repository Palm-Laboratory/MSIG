"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { scoreSurveyAnswers, type Part1CompetencyKey, type Part2RiskKey, type Part3ProfileKey, type SurveyAnswers } from "@/lib/scoring";
import { SURVEY_QUESTIONS } from "@/lib/survey-data";

type Profile = {
  name: string;
  church: string;
};

type ScoreRow = {
  id: string;
  name: string;
  percent: number;
  feedback?: string;
};

const STORAGE_KEYS = {
  answers: "ges_answers",
  profile: "ges_user",
  legacyAnswers: "msig.answers",
  legacyProfile: "msig.profile",
} as const;

const COMPETENCY_LABELS: Record<Part1CompetencyKey, { name: string; low: string; high: string }> = {
  abraham: {
    name: "아브라함의 믿음",
    low: "재정의 주권을 하나님께 맡기는 기도와 점검 시간을 작게 시작해 보세요.",
    high: "재정을 하나님께 맡기는 태도가 안정적입니다. 주변을 격려하는 자원이 될 수 있습니다.",
  },
  david: {
    name: "다윗의 열정",
    low: "번아웃 신호를 살피고 안식과 일의 의미를 회복하는 시간이 필요합니다.",
    high: "일과 경제활동을 향한 활력이 좋습니다. 지속 가능한 리듬을 함께 관리하세요.",
  },
  joseph: {
    name: "요셉의 지혜",
    low: "수입과 지출을 보이는 곳에 기록하는 것부터 시작하면 변화가 빨라집니다.",
    high: "재정 관리의 기본기가 잘 잡혀 있습니다. 장기적인 실행력을 더해 보세요.",
  },
  nehemiah: {
    name: "느헤미야의 전략",
    low: "1년 단위 목표와 월별 예산처럼 작고 구체적인 계획부터 세워보세요.",
    high: "계획성과 실행 구조가 강점입니다. 다음 세대를 위한 재정 교육까지 확장해 보세요.",
  },
  samson: {
    name: "삼손의 위험 감지",
    low: "충동구매, 부채, 감정적 결정을 즉시 점검하고 필요하면 상담을 권합니다.",
    high: "경제적 위험 신호를 비교적 잘 관리하고 있습니다. 예방 습관을 유지하세요.",
  },
  daniel: {
    name: "다니엘의 일관성",
    low: "헌금, 세금, 약속 이행처럼 작은 경제 행동부터 신앙과 맞추어 보세요.",
    high: "신앙과 경제생활의 일치가 잘 드러납니다. 흔들리지 않는 원칙을 계속 훈련하세요.",
  },
};

const RISK_LABELS: Record<Part2RiskKey, string> = {
  esau: "에서 증후군",
  ahab: "아합 증후군",
  ananias: "아나니아 증후군",
  achan: "아간 증후군",
  richFool: "어리석은 부자 증후군",
  solomon: "솔로몬 증후군",
  oneTalentServant: "한 달란트 종 증후군",
  martha: "마르다 증후군",
};

const PROFILE_LABELS: Record<Part3ProfileKey, string> = {
  making: "버는 행동",
  spending: "쓰는 행동",
  investing: "불리는 행동",
  giving: "나누는 행동",
};

const ARCHETYPE_DETAILS: Record<string, { description: string; strength: string; weakness: string; prescription: string }> = {
  아브라함형: {
    description: "하나님의 공급을 신뢰하며 새로운 경제적 도전 앞에서도 의미를 먼저 찾는 유형입니다.",
    strength: "강한 믿음, 도전정신, 낙관성",
    weakness: "현실적 점검 없이 빠르게 결정할 위험",
    prescription: "요셉의 지혜와 느헤미야의 전략을 보강해 믿음과 계획을 함께 세우세요.",
  },
  나발형: {
    description: "관리와 축적 능력은 있으나 나눔과 관계의 기쁨이 약해질 수 있는 유형입니다.",
    strength: "저축능력, 절약정신",
    weakness: "인색함, 관계 단절, 나눔의 기쁨 상실",
    prescription: "작은 금액부터 기쁜 나눔을 정기적으로 실천해 보세요.",
  },
  야곱형: {
    description: "현실 감각과 실행력이 좋고 목표 달성을 위한 방법을 빠르게 찾는 유형입니다.",
    strength: "전략적 사고, 실행력, 적응력",
    weakness: "성과를 위해 윤리적 경계를 흐릴 위험",
    prescription: "다니엘의 일관성을 본받아 정직한 방식으로 경제활동을 정렬하세요.",
  },
  발람형: {
    description: "기회 포착력은 있으나 돈이 신앙의 중심을 밀어낼 수 있어 주의가 필요합니다.",
    strength: "경제적 감각, 기회 포착력",
    weakness: "맘몬 숭배 위험, 영적 타협",
    prescription: "아브라함의 믿음으로 돌아가 재정의 주인을 다시 확인하세요.",
  },
  엘리야형: {
    description: "경험과 분별은 있으나 현재 에너지와 회복 탄력성이 낮아질 수 있는 유형입니다.",
    strength: "과거 경험과 지혜",
    weakness: "무기력, 포기 심리",
    prescription: "안식과 재충전을 통해 다윗의 열정을 회복하는 계획이 필요합니다.",
  },
  아간형: {
    description: "대담하게 움직이지만 위험한 투자나 욕심에 노출될 가능성이 높은 유형입니다.",
    strength: "추진력, 대담함",
    weakness: "도박성 투자, 탐욕, 법적 위험",
    prescription: "느헤미야의 전략과 위험 경계 훈련을 우선순위에 두세요.",
  },
  탕자형: {
    description: "관대하고 사교적이지만 수입 대비 지출 통제가 약해 미래 불안으로 이어질 수 있습니다.",
    strength: "관대함, 사교성",
    weakness: "무절제, 저축 부족, 미래 불안",
    prescription: "요셉의 지혜로 지출 관리와 자동 저축을 시작하세요.",
  },
  므비보셋형: {
    description: "겸손하고 순종적인 태도는 있으나 경제적 자립과 선택 훈련이 더 필요한 유형입니다.",
    strength: "겸손함, 순종적 태도",
    weakness: "의존성, 자립 능력 부족, 소극성",
    prescription: "작은 목표를 스스로 달성하며 다윗의 열정을 키워보세요.",
  },
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

function BarRow({ row }: { row: ScoreRow }) {
  return (
    <div className="bar-row">
      <div className="bar-meta">
        <span>{row.name}</span>
        <strong>{row.percent}%</strong>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${row.percent}%` }} />
      </div>
      {row.feedback ? <p>{row.feedback}</p> : null}
    </div>
  );
}

export function ResultView() {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [profile, setProfile] = useState<Profile>({ name: "", church: "" });
  const [today, setToday] = useState("");

  useEffect(() => {
    setAnswers(loadJson<SurveyAnswers>(STORAGE_KEYS.answers, {}, STORAGE_KEYS.legacyAnswers));
    setProfile(loadJson<Profile>(STORAGE_KEYS.profile, { name: "", church: "" }, STORAGE_KEYS.legacyProfile));
    setToday(new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(new Date()));
  }, []);

  const result = useMemo(() => scoreSurveyAnswers(answers), [answers]);
  const totalAnswered = SURVEY_QUESTIONS.filter((question) => answers[question.id]).length;
  const overall = Math.round(result.part1.percentage);
  const capacityScores = (Object.entries(result.part1.competencies) as Array<[Part1CompetencyKey, (typeof result.part1.competencies)[Part1CompetencyKey]]>).map(
    ([key, score]) => {
      const percent = Math.round(score.percentage);
      const label = COMPETENCY_LABELS[key];
      return {
        id: key,
        name: label.name,
        percent,
        feedback: percent >= 50 ? label.high : label.low,
      };
    },
  );
  const riskScores = (Object.entries(result.part2.risks) as Array<[Part2RiskKey, (typeof result.part2.risks)[Part2RiskKey]]>).map(([key, score]) => ({
    id: key,
    name: RISK_LABELS[key],
    percent: Math.round(score.percentage),
    level: score.level,
  }));
  const profileScores = (Object.entries(result.part3.profile) as Array<[Part3ProfileKey, (typeof result.part3.profile)[Part3ProfileKey]]>).map(([key, score]) => ({
    id: key,
    name: score.name,
    percent: Math.round(score.percentage),
  }));
  const archetype = {
    ...result.economicArchetype,
    ...(ARCHETYPE_DETAILS[result.economicArchetype.name] ?? ARCHETYPE_DETAILS.엘리야형),
  };

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEYS.answers);
    window.localStorage.removeItem(STORAGE_KEYS.profile);
    window.localStorage.removeItem(STORAGE_KEYS.legacyAnswers);
    window.localStorage.removeItem(STORAGE_KEYS.legacyProfile);
  };

  if (totalAnswered === 0) {
    return (
      <main className="result-shell empty-state">
        <div className="survey-card">
          <p className="section-kicker">결과 없음</p>
          <h1>저장된 설문 응답이 없습니다.</h1>
          <p>진단을 시작하면 응답이 브라우저에 임시 저장되고 결과지가 생성됩니다.</p>
          <Link className="button primary" href="/diagnosis/info">
            진단 시작하기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="result-shell">
      <section className="result-hero">
        <div>
          <Link className="brand-mark" href="/">
            MSIG
          </Link>
          <p className="section-kicker">복음경제영성 진단 결과</p>
          <h1>{profile.name || "수검자"}님의 경제영성 프로파일</h1>
          <p>응답 {totalAnswered}/{SURVEY_QUESTIONS.length}문항 기준으로 현재의 강점, 위험 신호, 행동 균형을 정리했습니다.</p>
        </div>
        <div className="score-card">
          <span>종합 경제영성 지수</span>
          <strong>{overall}</strong>
          <p>
            {result.part1.grade.code} · {result.part1.grade.label}
          </p>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${overall}%` }} />
          </div>
        </div>
      </section>

      <section className="result-grid compact">
        <div className="survey-card info-card">
          <span>이름</span>
          <strong>{profile.name || "미입력"}</strong>
        </div>
        <div className="survey-card info-card">
          <span>출석 교회</span>
          <strong>{profile.church || "미입력"}</strong>
        </div>
        <div className="survey-card info-card">
          <span>검사 일자</span>
          <strong>{today}</strong>
        </div>
      </section>

      <section className="result-grid">
        <article className="survey-card archetype-card">
          <p className="section-kicker">나의 경제유형</p>
          <div className="character-slot">
            <span>{archetype.subtitle}</span>
            <strong>{archetype.name}</strong>
          </div>
          <p>{archetype.description}</p>
          <dl className="definition-list">
            <div>
              <dt>강점</dt>
              <dd>{archetype.strength}</dd>
            </div>
            <div>
              <dt>약점</dt>
              <dd>{archetype.weakness}</dd>
            </div>
            <div>
              <dt>처방</dt>
              <dd>{archetype.prescription}</dd>
            </div>
          </dl>
        </article>

        <article className="survey-card">
          <p className="section-kicker">6대 역량</p>
          <h2>강점과 보완 영역</h2>
          <div className="bars">
            {capacityScores.map((row) => (
              <BarRow key={row.id} row={row} />
            ))}
          </div>
        </article>
      </section>

      <section className="result-grid">
        <article className="survey-card">
          <p className="section-kicker">8대 경제장애 위험도</p>
          <h2>주의가 필요한 패턴</h2>
          <div className="risk-grid">
            {riskScores.map((row) => (
              <div className={`risk-pill ${row.level}`} key={row.id}>
                <span>{row.name}</span>
                <strong>{row.percent}% · {row.level}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="survey-card">
          <p className="section-kicker">MSIG 행동 프로파일</p>
          <h2>가장 낮은 영역은 {PROFILE_LABELS[result.part3.lowestArea.key]}입니다.</h2>
          <div className="bars">
            {profileScores.map((row) => (
              <BarRow key={row.id} row={row} />
            ))}
          </div>
        </article>
      </section>

      <footer className="result-actions no-print">
        <button className="button ghost" onClick={() => window.print()} type="button">
          결과지 인쇄/PDF 저장
        </button>
        <a className="button primary" href="mailto:contact@example.com?subject=MSIG%20상담%20신청">
          상담하기
        </a>
        <Link className="button soft" href="/diagnosis" onClick={reset}>
          다시 진단하기
        </Link>
      </footer>
    </main>
  );
}
