"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { scoreSurveyAnswers, type Part1CompetencyKey, type Part2RiskKey, type Part3ProfileKey, type SurveyAnswers } from "@/lib/scoring";
import { readJsonWithTtl, RESULT_STORAGE_KEYS } from "@/lib/storage";
import { SURVEY_QUESTIONS } from "@/lib/survey-data";

type ScoreRow = {
  id: string;
  name: string;
  percent: number;
  raw?: number;
  feedback?: string;
  color?: string;
  english?: string;
};

const COMPETENCY_LABELS: Record<Part1CompetencyKey, { name: string; low: string; high: string }> = {
  abraham: { name: "아브라함의 믿음", low: "재정의 주권을 하나님께 맡기는 기도와 점검 시간을 작게 시작해 보세요.", high: "재정을 하나님께 맡기는 태도가 안정적입니다." },
  david: { name: "다윗의 열정", low: "번아웃 신호를 살피고 안식과 일의 의미를 회복하는 시간이 필요합니다.", high: "일과 경제활동을 향한 활력이 좋습니다." },
  joseph: { name: "요셉의 지혜", low: "수입과 지출을 보이는 곳에 기록하는 것부터 시작하면 변화가 빨라집니다.", high: "재정 관리의 기본기가 잘 잡혀 있습니다." },
  nehemiah: { name: "느헤미야의 전략", low: "1년 단위 목표와 월별 예산처럼 작고 구체적인 계획부터 세워보세요.", high: "계획성과 실행 구조가 강점입니다." },
  samson: { name: "삼손의 위험 감지", low: "충동구매, 부채, 감정적 결정을 즉시 점검하고 필요하면 상담을 권합니다.", high: "경제적 위험 신호를 비교적 잘 관리하고 있습니다." },
  daniel: { name: "다니엘의 일관성", low: "헌금, 세금, 약속 이행처럼 작은 경제 행동부터 신앙과 맞추어 보세요.", high: "신앙과 경제생활의 일치가 잘 드러납니다." },
};

const RISK_LABELS: Record<Part2RiskKey, { name: string; subtitle: string }> = {
  esau: { name: "에서 증후군", subtitle: "충동 소비" },
  ahab: { name: "아합 증후군", subtitle: "경제적 의존" },
  ananias: { name: "아나니아 증후군", subtitle: "과시적 나눔" },
  achan: { name: "아간 증후군", subtitle: "탐욕 · 도박" },
  richFool: { name: "어리석은 부자 증후군", subtitle: "저장 집착" },
  solomon: { name: "솔로몬 증후군", subtitle: "과소비 · 사치" },
  oneTalentServant: { name: "한 달란트 증후군", subtitle: "가난의 맹세" },
  martha: { name: "마르다 증후군", subtitle: "일중독" },
};

const PROFILE_LABELS: Record<Part3ProfileKey, { name: string; english: string; color: string }> = {
  making: { name: "돈 버는 행동", english: "Making", color: "#2d9e6b" },
  spending: { name: "돈 쓰는 행동", english: "Spending", color: "#e8607a" },
  investing: { name: "돈 불리는 행동", english: "Investing", color: "#4f9af1" },
  giving: { name: "돈 나누는 행동", english: "Giving", color: "#f4a261" },
};

const RADAR_SHORT_LABELS: Record<string, string> = {
  abraham: "아브라함",
  david: "다윗",
  joseph: "요셉",
  nehemiah: "느헤미야",
  samson: "삼손",
  daniel: "다니엘",
};

const RADAR_ORDER: Part1CompetencyKey[] = ["abraham", "joseph", "david", "nehemiah", "samson", "daniel"];

const RESULT_GRADE_THEMES: Record<string, { accent: string; soft: string }> = {
  "A+": { accent: "#ed536c", soft: "#ffe6eb" },
  A: { accent: "#ed536c", soft: "#ffe6eb" },
  "B+": { accent: "#1f9f68", soft: "#e2f8ee" },
  B: { accent: "#3b82f6", soft: "#e7f1ff" },
  C: { accent: "#e07830", soft: "#fff0df" },
  D: { accent: "#dc2626", soft: "#ffe1e1" },
  F: { accent: "#991b1b", soft: "#f5d5d5" },
};

const CAPACITY_CARD_STYLES: Record<Part1CompetencyKey, { accent: string; bg: string; text: string }> = {
  abraham: { accent: "#9b4250", bg: "#fffafa", text: "#603139" },
  david: { accent: "#77584e", bg: "#fffdfc", text: "#563c34" },
  joseph: { accent: "#7a7b7a", bg: "#fdfffd", text: "#3e3e3e" },
  nehemiah: { accent: "#587a79", bg: "#faffff", text: "#304040" },
  samson: { accent: "#53618b", bg: "#fdfeff", text: "#282f45" },
  daniel: { accent: "#7b5980", bg: "#fffdff", text: "#453148" },
};

const ARCHETYPE_DETAILS: Record<string, { description: string; strength: string; weakness: string; prescription: string; image: string }> = {
  아브라함형: { description: "높은 믿음과 도전 정신을 바탕으로 경제적 위험도 감수하며, 하나님의 인도하심을 믿고 과감하게 결정을 내리고 나아가는 유형입니다.", strength: "강한 믿음, 도전 정신, 낙관성", weakness: "무모한 투자 위험, 현실 감각 부족", prescription: "요셉의 지혜와 느헤미야의 전략을 보강해 믿음과 계획을 함께 세우세요.", image: "/images/아브라함_.png" },
  나발형: { description: "관리와 축적 능력은 있으나 나눔과 관계의 기쁨이 약해질 수 있는 유형입니다.", strength: "저축 능력, 절약 정신", weakness: "인색함, 관계 단절, 나눔의 기쁨 상실", prescription: "작은 것부터 나누는 연습을 시작하세요.", image: "/images/나발_.png" },
  야곱형: { description: "현실 감각과 실행력이 좋고 목표 달성을 위한 방법을 빠르게 찾는 유형입니다.", strength: "전략적 사고, 실행력, 적응력", weakness: "편법 유혹, 윤리적 경계 모호", prescription: "다니엘의 일관성을 본받아 정직한 방식으로 경제활동을 정렬하세요.", image: "/images/야곱_.png" },
  발람형: { description: "기회 포착력은 있으나 돈이 신앙의 중심을 밀어낼 수 있어 주의가 필요합니다.", strength: "경제적 감각, 기회 포착력", weakness: "맘몬 숭배 위험, 영적 타협", prescription: "아브라함의 믿음으로 돌아가 재정의 주인을 다시 확인하세요.", image: "/images/발람_.png" },
  엘리야형: { description: "경험과 분별은 있으나 현재 에너지와 회복 탄력성이 낮아질 수 있는 유형입니다.", strength: "과거 경험과 지혜", weakness: "무기력, 포기 심리", prescription: "다윗의 열정을 회복하세요. 안식과 재충전의 시간이 필요합니다.", image: "/images/엘리야_.png" },
  아간형: { description: "대담하게 움직이지만 위험한 투자나 욕심에 노출될 가능성이 높은 유형입니다.", strength: "추진력, 대담함", weakness: "도박성 투자, 탐욕, 법적 위험", prescription: "느헤미야의 전략과 삼손의 위험 경계 훈련을 우선순위에 두세요.", image: "/images/아간_.png" },
  탕자형: { description: "관대하고 사교적이지만 수입 대비 지출 통제가 약해 미래 불안으로 이어질 수 있습니다.", strength: "관대함, 사교성", weakness: "무절제, 저축 부족, 미래 불안", prescription: "요셉의 지혜로 수입 대비 지출 관리를 시작하세요.", image: "/images/탕자_.png" },
  므비보셋형: { description: "겸손하고 순종적인 태도는 있으나 경제적 자립과 선택 훈련이 더 필요한 유형입니다.", strength: "겸손함, 순종적 태도", weakness: "의존성, 자립 능력 부족, 소극성", prescription: "다윗의 열정으로 작은 목표부터 스스로 달성해보세요.", image: "/images/므비보셋_.png" },
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function PrintGauge({ color, label, percent, sublabel }: { color: string; label: string; percent: number; sublabel: string }) {
  const progress = clamp(percent);
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <div className="print-gauge">
      <svg aria-hidden="true" height="240" viewBox="0 0 240 240" width="240">
        <circle cx="120" cy="120" fill="none" r={radius} stroke="#ebe4e4" strokeWidth="18" />
        <circle cx="120" cy="120" fill="none" r={radius} stroke={color} strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" strokeWidth="18" transform="rotate(-90 120 120)" />
      </svg>
      <div className="print-gauge-center">
        <strong style={{ color }}>{label}</strong>
        <span>{sublabel}</span>
      </div>
    </div>
  );
}

function PrintRadar({ rows }: { rows: ScoreRow[] }) {
  const orderedRows = RADAR_ORDER.map((id) => rows.find((row) => row.id === id)).filter((row): row is ScoreRow => Boolean(row));
  const width = 540;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 112;
  const topPercent = Math.max(...orderedRows.map((row) => row.percent));
  const points = orderedRows.map((row, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
    const value = clamp(row.percent) / 100;
    return `${centerX + Math.cos(angle) * radius * value},${centerY + Math.sin(angle) * radius * value}`;
  });

  return (
    <svg className="print-radar" viewBox={`0 0 ${width} ${height}`}>
      {[1, 0.75, 0.5].map((scale) => (
        <circle cx={centerX} cy={centerY} fill="none" key={scale} r={radius * scale} stroke="rgba(232,96,122,0.25)" strokeWidth="1.4" />
      ))}
      {orderedRows.map((row, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
        return <line key={row.id} stroke="rgba(120,90,90,0.22)" strokeWidth="1.2" x1={centerX} x2={centerX + Math.cos(angle) * radius} y1={centerY} y2={centerY + Math.sin(angle) * radius} />;
      })}
      <polygon fill="rgba(155,66,80,0.16)" points={points.join(" ")} stroke="#e8607a" strokeLinejoin="round" strokeWidth="5" />
      {orderedRows.map((row, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
        const labelRadius = 156;
        const isTop = row.percent === topPercent;
        return (
          <text fill={isTop ? "#d94b64" : "#68484d"} fontSize="18" fontWeight={isTop ? 800 : 500} key={row.id} textAnchor="middle" x={centerX + Math.cos(angle) * labelRadius} y={centerY + Math.sin(angle) * labelRadius}>
            {RADAR_SHORT_LABELS[row.id]} {row.percent}%
          </text>
        );
      })}
    </svg>
  );
}

function PrintPage({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" | "pink" }) {
  return <section className={`print-page print-page-${tone}`}>{children}</section>;
}

export function ResultPrintView() {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAnswers(readJsonWithTtl<SurveyAnswers>(RESULT_STORAGE_KEYS.answers, {}, RESULT_STORAGE_KEYS.legacyAnswers));
    setLoaded(true);
  }, []);

  const result = useMemo(() => scoreSurveyAnswers(answers), [answers]);
  const totalAnswered = SURVEY_QUESTIONS.filter((question) => answers[question.id]).length;
  const overall = Math.round(result.part1.percentage);
  const gradeTheme = RESULT_GRADE_THEMES[result.part1.grade.code] ?? RESULT_GRADE_THEMES.A;
  const capacityScores = (Object.entries(result.part1.competencies) as Array<[Part1CompetencyKey, (typeof result.part1.competencies)[Part1CompetencyKey]]>).map(([key, score]) => {
    const percent = Math.round(score.percentage);
    const label = COMPETENCY_LABELS[key];
    return { id: key, name: label.name, percent, feedback: percent >= 50 ? label.high : label.low };
  });
  const topCapacity = [...capacityScores].sort((a, b) => b.percent - a.percent)[0];
  const topCapacityNames = capacityScores.filter((row) => row.percent === topCapacity.percent).map((row) => RADAR_SHORT_LABELS[row.id] ?? row.name);
  const riskScores = (Object.entries(result.part2.risks) as Array<[Part2RiskKey, (typeof result.part2.risks)[Part2RiskKey]]>).map(([key, score]) => ({
    id: key,
    ...RISK_LABELS[key],
    percent: Math.round(score.percentage),
    level: score.level,
  }));
  const profileScores = (Object.entries(result.part3.profile) as Array<[Part3ProfileKey, (typeof result.part3.profile)[Part3ProfileKey]]>).map(([key, score]) => ({
    id: key,
    ...PROFILE_LABELS[key],
    percent: Math.round(score.percentage),
    raw: score.rawScore,
  }));
  const archetype = {
    ...result.economicArchetype,
    ...(ARCHETYPE_DETAILS[result.economicArchetype.name] ?? ARCHETYPE_DETAILS.엘리야형),
  };

  if (!loaded) return <main className="print-loading" />;

  if (totalAnswered < SURVEY_QUESTIONS.length) {
    return (
      <main className="print-empty">
        <h1>완료된 설문 응답이 없습니다.</h1>
        <p>현재 저장된 응답은 {totalAnswered}/{SURVEY_QUESTIONS.length}문항입니다.</p>
        <Link href="/diagnosis/info">진단 시작하기</Link>
      </main>
    );
  }

  return (
    <main className="print-result">
      <div className="print-toolbar">
        <Link href="/diagnosis/result">결과로 돌아가기</Link>
        <button onClick={() => window.print()} type="button">PDF 저장하기</button>
      </div>

      <PrintPage>
        <div className="print-cover">
          <p className="print-eyebrow">GOSPEL ECONOMIC SPIRITUALITY</p>
          <h1>종합 진단 결과</h1>
          <PrintGauge color={gradeTheme.accent} label={result.part1.grade.code} percent={overall} sublabel={`${overall} / 100점 · ${result.part1.grade.label}`} />
        </div>
      </PrintPage>

      <PrintPage>
        <div className="print-type-grid">
          <div className="print-type-copy">
            <p className="print-eyebrow">ECONOMIC TYPE</p>
            <h2>{archetype.name}</h2>
            <h3>{archetype.subtitle}</h3>
            <p>{archetype.description}</p>
            <div className="print-traits">
              <div><strong>강점</strong><span>{archetype.strength}</span></div>
              <div><strong>약점</strong><span>{archetype.weakness}</span></div>
              <div><strong>처방</strong><span>{archetype.prescription}</span></div>
            </div>
          </div>
          <div className="print-type-card">
            <img alt={`${archetype.name} 이미지`} src={archetype.image} />
            <strong>{archetype.name}</strong>
            <span>{archetype.subtitle}</span>
          </div>
        </div>
      </PrintPage>

      <PrintPage tone="pink">
        <div className="print-section-title">
          <p className="print-eyebrow">GOSPEL ECONOMIC SPIRITUALITY</p>
          <h2>6대 성경인물 역량 분석</h2>
        </div>
        <div className="print-capacity-grid">
          <div>
            <PrintRadar rows={capacityScores} />
            <div className="print-top-capacity">
              <span>주요 유형</span>
              <strong>{topCapacityNames.join(" · ")}</strong>
              <em>{topCapacity.percent}% 일치</em>
            </div>
          </div>
          <div className="print-score-list">
            {capacityScores.map((row) => (
              <article
                key={row.id}
                style={
                  {
                    "--capacity-accent": CAPACITY_CARD_STYLES[row.id as Part1CompetencyKey]?.accent,
                    "--capacity-bg": CAPACITY_CARD_STYLES[row.id as Part1CompetencyKey]?.bg,
                    "--capacity-text": CAPACITY_CARD_STYLES[row.id as Part1CompetencyKey]?.text,
                  } as CSSProperties
                }
              >
                <div><strong>{row.name}</strong><span>{row.percent}%</span></div>
                <span className="print-score-bar" aria-label={`${row.name} ${row.percent}%`}>
                  <i style={{ width: `${row.percent}%` }} />
                </span>
                <p>{row.feedback}</p>
              </article>
            ))}
          </div>
        </div>
      </PrintPage>

      <PrintPage tone="dark">
        <div className="print-section-title">
          <p className="print-eyebrow">GOSPEL ECONOMIC SPIRITUALITY</p>
          <h2>8대 경제장애 위험도</h2>
        </div>
        <div className="print-risk-grid">
          {riskScores.map((risk) => (
            <article className={`print-risk-${risk.level}`} key={risk.id}>
              <div><strong>{risk.name}</strong><span>{risk.subtitle}</span></div>
              <em>{risk.level}</em>
            </article>
          ))}
        </div>
      </PrintPage>

      <PrintPage>
        <div className="print-section-title">
          <p className="print-eyebrow">GOSPEL ECONOMIC SPIRITUALITY</p>
          <h2>MSIG 행동 프로파일</h2>
        </div>
        <div className="print-profile-grid">
          {profileScores.map((row) => (
            <article key={row.id}>
              <PrintGauge color={row.color} label={`${row.percent}%`} percent={row.percent} sublabel={`${row.raw} / 20`} />
              <strong>{row.name}</strong>
              <span>({row.english})</span>
            </article>
          ))}
        </div>
        <p className="print-profile-note">M(Making)·S(Spending)·I(Investing)·G(Giving) 네 영역이 균형을 이루는 것이 건강한 경제영성의 표지입니다. 가장 낮은 영역부터 개선해나가세요.</p>
      </PrintPage>
    </main>
  );
}
