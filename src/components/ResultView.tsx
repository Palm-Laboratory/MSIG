"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
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
  partIndex: "ges_part_index",
} as const;

const RESULT_BACK_WARNING = "다운받지 않은 결과는 저장되지 않습니다.";

const COMPETENCY_LABELS: Record<Part1CompetencyKey, { name: string; low: string; high: string }> = {
  abraham: {
    name: "아브라함의 믿음",
    low: "재정의 주권을 하나님께 맡기는 기도와 점검 시간을 작게 시작해 보세요.",
    high: "재정을 하나님께 맡기는 태도가 안정적입니다.",
  },
  david: {
    name: "다윗의 열정",
    low: "번아웃 신호를 살피고 안식과 일의 의미를 회복하는 시간이 필요합니다.",
    high: "일과 경제활동을 향한 활력이 좋습니다.",
  },
  joseph: {
    name: "요셉의 지혜",
    low: "수입과 지출을 보이는 곳에 기록하는 것부터 시작하면 변화가 빨라집니다.",
    high: "재정 관리의 기본기가 잘 잡혀 있습니다.",
  },
  nehemiah: {
    name: "느헤미야의 전략",
    low: "1년 단위 목표와 월별 예산처럼 작고 구체적인 계획부터 세워보세요.",
    high: "계획성과 실행 구조가 강점입니다.",
  },
  samson: {
    name: "삼손의 위험 감지",
    low: "충동구매, 부채, 감정적 결정을 즉시 점검하고 필요하면 상담을 권합니다.",
    high: "경제적 위험 신호를 비교적 잘 관리하고 있습니다.",
  },
  daniel: {
    name: "다니엘의 일관성",
    low: "헌금, 세금, 약속 이행처럼 작은 경제 행동부터 신앙과 맞추어 보세요.",
    high: "신앙과 경제생활의 일치가 잘 드러납니다.",
  },
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

const RESULT_MOBILE_NAV_ITEMS = [
  { label: "진단 소개", href: "/diagnosis/info" },
  { label: "검사 과정", href: "/diagnosis/info#process" },
  { label: "결과 유형", href: "/diagnosis/info#archetypes" },
  { label: "FAQ", href: "/diagnosis/info#faq" },
] as const;

const RESULT_GRADE_THEMES: Record<string, { arcEnd: string; arcStart: string; gradeEnd: string; gradeStart: string; score: string }> = {
  "A+": { arcStart: "#f87f7f", arcEnd: "#ffbcbc", gradeStart: "#ed536c", gradeEnd: "#ffa8b6", score: "#f37d90" },
  A: { arcStart: "#f87f7f", arcEnd: "#ffbcbc", gradeStart: "#ed536c", gradeEnd: "#ffa8b6", score: "#f37d90" },
  "B+": { arcStart: "#35b779", arcEnd: "#b9efd8", gradeStart: "#1f9f68", gradeEnd: "#8be5bc", score: "#2fb97b" },
  B: { arcStart: "#4f9af1", arcEnd: "#b9d9ff", gradeStart: "#3b82f6", gradeEnd: "#9ecbff", score: "#4f9af1" },
  C: { arcStart: "#f59e42", arcEnd: "#ffd7a8", gradeStart: "#e07830", gradeEnd: "#ffc083", score: "#f59e42" },
  D: { arcStart: "#ef4444", arcEnd: "#ffb4b4", gradeStart: "#dc2626", gradeEnd: "#ff9b9b", score: "#ef4444" },
  F: { arcStart: "#991b1b", arcEnd: "#d48a8a", gradeStart: "#991b1b", gradeEnd: "#ef7777", score: "#b91c1c" },
};

const getResultGradeTheme = (grade: string) => RESULT_GRADE_THEMES[grade] ?? RESULT_GRADE_THEMES.A;

const CAPACITY_CARD_STYLES: Record<Part1CompetencyKey, { accent: string; bg: string; text: string }> = {
  abraham: { accent: "#9b4250", bg: "#fffafa", text: "#603139" },
  david: { accent: "#77584e", bg: "#fffdfc", text: "#563c34" },
  joseph: { accent: "#7a7b7a", bg: "#fdfffd", text: "#3e3e3e" },
  nehemiah: { accent: "#587a79", bg: "#faffff", text: "#304040" },
  samson: { accent: "#53618b", bg: "#fdfeff", text: "#282f45" },
  daniel: { accent: "#7b5980", bg: "#fffdff", text: "#453148" },
};

const ARCHETYPE_DETAILS: Record<string, { description: string; strength: string; weakness: string; prescription: string; image: string }> = {
  아브라함형: {
    description: "높은 믿음과 도전 정신을 바탕으로 경제적 위험도 감수하며, 하나님의 인도하심을 믿고 과감하게 결정을 내리고 나아가는 유형입니다.",
    strength: "강한 믿음, 도전 정신, 낙관성",
    weakness: "무모한 투자 위험, 현실 감각 부족",
    prescription: "요셉의 지혜(재정 관리)와 느헤미야의 전략(계획성)을 보강해 믿음과 계획을 함께 세우세요.",
    image: "/images/아브라함_.png",
  },
  나발형: {
    description: "관리와 축적 능력은 있으나 나눔과 관계의 기쁨이 약해질 수 있는 유형입니다.",
    strength: "저축 능력, 절약 정신",
    weakness: "인색함, 관계 단절, 나눔의 기쁨 상실",
    prescription: "기쁜 나눔의 훈련이 필요합니다. 작은 것부터 나누는 연습을 시작하세요.",
    image: "/images/나발_.png",
  },
  야곱형: {
    description: "현실 감각과 실행력이 좋고 목표 달성을 위한 방법을 빠르게 찾는 유형입니다.",
    strength: "전략적 사고, 실행력, 적응력",
    weakness: "편법 유혹, 윤리적 경계 모호",
    prescription: "다니엘의 일관성(사행일치)을 본받아 정직한 방식으로 경제활동을 정렬하세요.",
    image: "/images/야곱_.png",
  },
  발람형: {
    description: "기회 포착력은 있으나 돈이 신앙의 중심을 밀어낼 수 있어 주의가 필요합니다.",
    strength: "경제적 감각, 기회 포착력",
    weakness: "맘몬 숭배 위험, 영적 타협",
    prescription: "아브라함의 믿음(강한 믿음)으로 돌아가 재정의 주인을 다시 확인하세요.",
    image: "/images/발람_.png",
  },
  엘리야형: {
    description: "경험과 분별은 있으나 현재 에너지와 회복 탄력성이 낮아질 수 있는 유형입니다.",
    strength: "과거 경험과 지혜",
    weakness: "무기력, 포기 심리",
    prescription: "다윗의 열정을 회복하세요. 안식과 재충전의 시간이 필요합니다.",
    image: "/images/엘리야_.png",
  },
  아간형: {
    description: "대담하게 움직이지만 위험한 투자나 욕심에 노출될 가능성이 높은 유형입니다.",
    strength: "추진력, 대담함",
    weakness: "도박성 투자, 탐욕, 법적 위험",
    prescription: "느헤미야의 전략(치밀한 계획)과 삼손의 교휸(위험 경계 훈련)을 우선순위에 두세요.",
    image: "/images/아간_.png",
  },
  탕자형: {
    description: "관대하고 사교적이지만 수입 대비 지출 통제가 약해 미래 불안으로 이어질 수 있습니다.",
    strength: "관대함, 사교성",
    weakness: "무절제, 저축 부족, 미래 불안",
    prescription: "요셉의 지혜로 수입 대비 지출 관리를 시작하고 자동이체 저축을 실행하세요.",
    image: "/images/탕자_.png",
  },
  므비보셋형: {
    description: "겸손하고 순종적인 태도는 있으나 경제적 자립과 선택 훈련이 더 필요한 유형입니다.",
    strength: "겸손함, 순종적 태도",
    weakness: "의존성, 자립 능력 부족, 소극성",
    prescription: "다윗의 열정으로 경제적 자립 의지를 키우고 작은 목표부터 스스로 달성해보세요.",
    image: "/images/므비보셋_.png",
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

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function SectionTitle({ align = "left", dark = false, title }: { align?: "left" | "center"; dark?: boolean; title: string }) {
  return (
    <div className={`flex flex-col gap-[25.2px] ${align === "center" ? "items-center text-center" : "items-start"}`}>
      <p className="text-[1.3125rem] font-medium uppercase leading-[1.05rem] tracking-[1.05px] text-[#dc657b]">GOSPEL ECONOMIC SPIRITUALITY</p>
      <h2 className={`text-[3.75rem] font-bold leading-[3.75rem] ${dark ? "text-[#fff7f7]" : "text-[#312225]"}`}>{title}</h2>
    </div>
  );
}

function ScoreDonut({ color, percent, showValue = true, size = 140 }: { color: string; percent: number; showValue?: boolean; size?: number }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamp(percent) / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ height: size, width: size }}>
      <svg aria-hidden="true" className="-rotate-90" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <circle cx={size / 2} cy={size / 2} fill="none" r={radius} stroke="#f0dfde" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} fill="none" r={radius} stroke={color} strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" strokeWidth={stroke} />
      </svg>
      {showValue ? (
        <strong className="absolute text-[1.5625rem] font-bold leading-none" style={{ color }}>
          {Math.round(percent)}%
        </strong>
      ) : null}
    </div>
  );
}

function OverallRankCircle({ grade, label, percent }: { grade: string; label: string; percent: number }) {
  const progress = clamp(percent);
  const arcLength = 70;
  const progressLength = (progress / 100) * arcLength;
  const arcStartAngle = 145;
  const [displayPercent, setDisplayPercent] = useState(0);
  const theme = getResultGradeTheme(grade);
  const animatedArcStyle = {
    "--result-arc-offset": progressLength,
    strokeDashoffset: progressLength,
  } as CSSProperties;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayPercent(Math.round(progress));
      return;
    }

    let animationFrame = 0;
    let startTime: number | null = null;
    const duration = 950;
    const delay = 360;
    const target = Math.round(progress);

    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

    const update = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;

      if (elapsed < delay) {
        setDisplayPercent(0);
        animationFrame = window.requestAnimationFrame(update);
        return;
      }

      const ratio = clamp((elapsed - delay) / duration, 0, 1);
      setDisplayPercent(Math.round(target * easeOut(ratio)));

      if (ratio < 1) {
        animationFrame = window.requestAnimationFrame(update);
      }
    };

    setDisplayPercent(0);
    animationFrame = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [progress]);

  return (
    <div className="relative h-[316px] w-[292px] rounded-[9.225px]">
      <svg aria-hidden="true" className="absolute left-[-8px] top-[-8px] h-[292px] w-[308px] overflow-visible" fill="none" viewBox="0 0 308 292">
        <circle
          cx="154"
          cy="154"
          pathLength="100"
          r="132"
          stroke="#e3dede"
          strokeDasharray={`${arcLength} 100`}
          strokeLinecap="round"
          strokeWidth="16.8168"
          transform={`rotate(${arcStartAngle} 154 154)`}
        />
        <circle
          className="result-arc"
          cx="154"
          cy="154"
          pathLength="100"
          r="132"
          stroke="url(#overall-rank-gradient)"
          strokeDasharray={`${progressLength} 100`}
          strokeLinecap="round"
          strokeWidth="16.8168"
          style={animatedArcStyle}
          transform={`rotate(${arcStartAngle} 154 154)`}
        />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="overall-rank-gradient" x1="286" x2="22" y1="154" y2="154">
            <stop stopColor={theme.arcEnd} />
            <stop offset="1" stopColor={theme.arcStart} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-1/2 top-[100.72px] flex -translate-x-1/2 flex-col items-center gap-[45.36px] text-center">
        <strong className="bg-clip-text text-[5.67rem] font-bold leading-[5.67rem] tracking-[0.3459px] text-transparent drop-shadow-[0_3.075px_6.15px_rgba(0,0,0,0.15)]" style={{ backgroundImage: `linear-gradient(180deg, ${theme.gradeStart}, ${theme.gradeEnd})` }}>
          {grade}
        </strong>
        <div className="flex flex-col items-center gap-[12.3px]">
          <p className="flex items-end justify-center gap-[8.456px] whitespace-nowrap text-center tracking-[0.3459px]">
            <span className="text-[2.10213rem] font-bold leading-[2.10213rem]" style={{ color: theme.score }}>
              {displayPercent}
            </span>
            <span className="text-[1.20119rem] font-medium leading-[1.20119rem] text-[#949494]">/ 100점</span>
          </p>
          <p className="flex items-center justify-center gap-[12.3px] whitespace-nowrap text-center tracking-[0.3459px]">
            <span className="text-[1.15312rem] font-medium leading-[1.34537rem] text-[#78716c]">등급:</span>
            <span className="text-[1.20119rem] font-medium leading-[1.20119rem]" style={{ color: theme.score }}>
              {label}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ rows }: { rows: ScoreRow[] }) {
  const orderedRows = RADAR_ORDER.map((id) => rows.find((row) => row.id === id)).filter((row): row is ScoreRow => Boolean(row));
  const width = 554;
  const height = 320;
  const centerX = width / 2;
  const centerY = 160;
  const radius = 98;
  const labelPositions = [
    { anchor: "middle", x: centerX, y: 16 },
    { anchor: "start", x: 398, y: 108 },
    { anchor: "start", x: 398, y: 228 },
    { anchor: "middle", x: centerX, y: 302 },
    { anchor: "end", x: 156, y: 228 },
    { anchor: "end", x: 156, y: 108 },
  ] as const;
  const points = orderedRows.map((row, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
    const value = clamp(row.percent) / 100;
    return `${centerX + Math.cos(angle) * radius * value},${centerY + Math.sin(angle) * radius * value}`;
  });

  return (
    <svg className="h-[320px] w-full max-w-[554px] overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      {[1, 0.8, 0.6].map((scale) => (
        <circle cx={centerX} cy={centerY} fill="none" key={scale} r={radius * scale} stroke={`rgba(255,126,126,${scale === 1 ? 0.4 : scale === 0.8 ? 0.3 : 0.2})`} strokeWidth="1.15" />
      ))}
      {orderedRows.map((row, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
        return <line key={`axis-${row.id}`} stroke="rgba(177,178,177,0.2)" strokeWidth="1.15" x1={centerX} x2={centerX + Math.cos(angle) * radius} y1={centerY} y2={centerY + Math.sin(angle) * radius} />;
      })}
      <polygon fill="rgba(155,66,80,0.16)" points={points.join(" ")} stroke="#ff6f8a" strokeLinejoin="round" strokeWidth="6.8" />
      {points.map((point, index) => {
        const [x, y] = point.split(",").map(Number);
        return <circle cx={x} cy={y} fill="#ff5f7d" key={`${point}-${index}`} r="8.2" />;
      })}
      {orderedRows.map((row, index) => {
        const label = labelPositions[index] ?? labelPositions[0];
        const isTop = index === 0;
        return (
          <text dominantBaseline="middle" fill={isTop ? "#f36b80" : "#7c5050"} fontSize="18.3" fontWeight={isTop ? 700 : 500} key={row.id} textAnchor={label.anchor} x={label.x} y={label.y}>
            {RADAR_SHORT_LABELS[row.id] ?? row.name} ({row.percent}%)
          </text>
        );
      })}
    </svg>
  );
}

function TraitRow({ items, tone, title }: { items: string[]; tone: "green" | "orange"; title: string }) {
  const styles = tone === "green" ? "bg-[#f0fcf1] text-[#2e7d32] [--chip:#d8f9da] [--chipText:#1e8f60]" : "bg-[#fff1e8] text-[#e07830] [--chip:#ffdec7] [--chipText:#c06020]";
  return (
    <div className={`flex min-h-[74px] items-center gap-8 rounded px-0 ${styles}`}>
      <div className="flex h-full min-w-[154px] items-center gap-4">
        <span className="grid h-[74px] w-[74px] place-items-center bg-[var(--chip)] text-[1.625rem]">{tone === "green" ? "↗" : "!"}</span>
        <strong className="text-[1.1875rem] font-medium tracking-[0.05em]">{title}</strong>
      </div>
      <div className="flex flex-wrap gap-4 py-4">
        {items.map((item) => (
          <span className="rounded-full bg-[var(--chip)] px-5 py-2 text-[0.9375rem] font-medium leading-4 tracking-[0.05em] text-[var(--chipText)]" key={item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function DesktopTraitRow({ icon, items, tone, title }: { icon: string; items: string[]; tone: "green" | "orange"; title: string }) {
  const styles =
    tone === "green"
      ? {
        iconBg: "bg-[#d8f9da]",
        rowBg: "bg-[#f0fcf1]",
        text: "text-[#2e7d32]",
        chip: "bg-[#d8f9da] text-[#1e8f60]",
      }
      : {
        iconBg: "bg-[#ffdec7]",
        rowBg: "bg-[#fff1e8]",
        text: "text-[#e07830]",
        chip: "bg-[#ffdec7] text-[#c06020]",
      };

  return (
    <div className={`flex min-h-[74.2px] w-full items-center gap-[54.6px] rounded-[4.2px] max-[1210px]:gap-5 max-[1210px]:p-4 ${styles.rowBg}`}>
      <div className="flex min-h-[74.2px] shrink-0 items-center gap-[16.8px] max-[1210px]:min-h-16 max-[1210px]:gap-3">
        <span className={`grid min-h-[74.2px] w-[74.2px] place-items-center rounded-[4.2px] text-[1.75rem] font-medium max-[1210px]:min-h-16 max-[1210px]:w-16 ${styles.iconBg} ${styles.text}`}>{icon}</span>
        <strong className={`text-[1.18125rem] font-medium leading-[1.18125rem] tracking-[1.05px] max-[1210px]:text-base ${styles.text}`}>{title}</strong>
      </div>
      <div className="flex flex-wrap items-center gap-[29.4px] max-[1210px]:gap-3 max-[1210px]:py-1">
        {items.map((item) => (
          <span className={`rounded-full px-[21px] py-[10.5px] text-[0.91875rem] font-medium leading-[1.05rem] tracking-[1.05px] max-[1210px]:px-4 max-[1210px]:py-2 max-[1210px]:text-sm ${styles.chip}`} key={item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function RiskCard({ level, name, subtitle }: { level: string; name: string; subtitle: string }) {
  const isHigh = level === "고위험";
  const isWarning = level === "주의";
  const className = isHigh
    ? "border-[#ff6363] bg-[rgba(255,99,99,0.20)] text-[#ff6363] [--risk-pill-bg:rgba(255,99,99,0.30)] [--risk-pill-text:#ff6363]"
    : isWarning
      ? "border-[#f9a54d] bg-[rgba(249,165,77,0.18)] text-[#f9a54d] [--risk-pill-bg:rgba(249,165,77,0.30)] [--risk-pill-text:#f9a54d]"
      : "border-[#4be7a2] bg-[rgba(75,231,162,0.18)] text-[#4be7a2] [--risk-pill-bg:rgba(75,231,162,0.30)] [--risk-pill-text:#4be7a2]";

  return (
    <div className={`flex min-h-[100px] items-center justify-between rounded-[12px] border px-[25px] py-[29px] shadow-[0_4px_4px_rgba(0,0,0,0.10)] ${className}`}>
      <div className="grid gap-2">
        <strong className="block whitespace-nowrap text-[1.125rem] font-medium leading-[1.125rem]">{name}</strong>
        <span className="block text-[1rem] font-medium leading-[1rem] text-[#aeaeae]">{subtitle}</span>
      </div>
      <span className="rounded-full bg-[var(--risk-pill-bg)] px-3 py-1 text-[1rem] font-bold leading-[1rem] text-[var(--risk-pill-text)]">{level}</span>
    </div>
  );
}

function CapacityAnalysisCard({ row }: { row: ScoreRow }) {
  const style = CAPACITY_CARD_STYLES[row.id as Part1CompetencyKey] ?? CAPACITY_CARD_STYLES.abraham;

  return (
    <article className="flex flex-col gap-3 rounded-[12px] border-l-4 py-3 pl-7 pr-6 shadow-[0_4px_4px_rgba(0,0,0,0.10)]" style={{ backgroundColor: style.bg, borderLeftColor: style.accent }}>
      <div className="grid gap-2.5">
        <div className="flex items-start justify-between gap-4">
          <strong className="text-[1.125rem] font-medium leading-7" style={{ color: style.text }}>
            {row.name}
          </strong>
          <span className="text-[1rem] font-bold leading-6" style={{ color: style.text }}>
            {row.percent}%
          </span>
        </div>
        <div className="h-[8.7px] overflow-hidden rounded-full bg-[#e2e2e1]">
          <div className="h-full rounded-full" style={{ backgroundColor: style.accent, width: `${clamp(row.percent)}%` }} />
        </div>
      </div>
      <p className="text-[0.9375rem] font-medium leading-[1.375rem]" style={{ color: `${style.text}cc` }}>
        {row.feedback}
      </p>
    </article>
  );
}

function MobileSectionTitle({ dark = false, muted = false, title }: { dark?: boolean; muted?: boolean; title: string }) {
  return (
    <div className="flex flex-col items-center gap-3 whitespace-nowrap text-center tracking-[1px]">
      <p className={`text-[0.875rem] font-medium leading-[0.875rem] ${dark ? "text-[#e3a2ad]" : muted ? "text-[#f3b5c1]" : "text-[#cf7989]"}`}>GOSPEL ECONOMIC SPIRITUALITY</p>
      <h2 className={`text-[1.75rem] font-medium leading-[1.75rem] ${dark ? "text-[#fff7f7]" : muted ? "text-[#313332]" : "text-[#533030]"}`}>{title}</h2>
    </div>
  );
}

function MobileOverallRankCircle({ grade, label, percent }: { grade: string; label: string; percent: number }) {
  const progress = clamp(percent);
  const arcLength = 70;
  const arcStartAngle = 145;
  const progressLength = (progress / 100) * arcLength;
  const [displayPercent, setDisplayPercent] = useState(0);
  const theme = getResultGradeTheme(grade);
  const animatedArcStyle = {
    "--result-arc-offset": progressLength,
    strokeDashoffset: progressLength,
  } as CSSProperties;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayPercent(Math.round(progress));
      return;
    }

    let animationFrame = 0;
    let startTime: number | null = null;
    const duration = 950;
    const delay = 360;
    const target = Math.round(progress);

    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

    const update = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;

      if (elapsed < delay) {
        setDisplayPercent(0);
        animationFrame = window.requestAnimationFrame(update);
        return;
      }

      const ratio = clamp((elapsed - delay) / duration, 0, 1);
      setDisplayPercent(Math.round(target * easeOut(ratio)));

      if (ratio < 1) {
        animationFrame = window.requestAnimationFrame(update);
      }
    };

    setDisplayPercent(0);
    animationFrame = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [progress]);

  return (
    <div className="relative h-[179.354px] w-[214.808px] rounded-[6.781px]">
      <svg aria-hidden="true" className="absolute left-0 top-0 overflow-visible" fill="none" height="179.354" viewBox="0 0 214.808 179.354" width="214.808">
        <circle
          cx="107.404"
          cy="107.404"
          pathLength="100"
          r="93.8"
          stroke="#e3dede"
          strokeDasharray={`${arcLength} 100`}
          strokeLinecap="round"
          strokeWidth="11.31"
          transform={`rotate(${arcStartAngle} 107.404 107.404)`}
        />
        <circle
          className="result-arc"
          cx="107.404"
          cy="107.404"
          pathLength="100"
          r="93.8"
          stroke="url(#mobile-overall-rank-gradient)"
          strokeDasharray={`${progressLength} 100`}
          strokeLinecap="round"
          strokeWidth="11.31"
          style={animatedArcStyle}
          transform={`rotate(${arcStartAngle} 107.404 107.404)`}
        />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="mobile-overall-rank-gradient" x1="207" x2="8" y1="90" y2="90">
            <stop stopColor={theme.arcEnd} />
            <stop offset="1" stopColor={theme.arcStart} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-1/2 top-[74.03px] flex -translate-x-1/2 flex-col items-center gap-[33.34px] text-center">
        <strong className="bg-clip-text text-[4.25rem] font-bold leading-[4.25rem] tracking-[0.2543px] text-transparent drop-shadow-[0_2.26px_4.52px_rgba(0,0,0,0.15)]" style={{ backgroundImage: `linear-gradient(180deg, ${theme.gradeStart}, ${theme.gradeEnd})` }}>
          {grade}
        </strong>
        <div className="flex flex-col items-center gap-[9.041px]">
          <p className="flex items-end justify-center gap-[6.215px] whitespace-nowrap text-center tracking-[0.2543px]">
            <span className="text-[1.5rem] font-bold leading-6" style={{ color: theme.score }}>
              {displayPercent}
            </span>
            <span className="text-[0.875rem] font-medium leading-[0.875rem] text-[#949494]">/ 100점</span>
          </p>
          <p className="flex items-center justify-center gap-[9.041px] whitespace-nowrap text-center tracking-[0.2543px]">
            <span className="text-[0.875rem] font-medium leading-[0.875rem] text-[#78716c]">등급:</span>
            <span className="text-[0.875rem] font-medium leading-[0.875rem]" style={{ color: theme.score }}>
              {label}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// [모바일] 나의 경제 유형 타입
function MobileEconomicCard({
  archetype,
}: {
  archetype: { description: string; name: string; prescription: string; strength: string; subtitle: string; weakness: string };
}) {
  const strengths = archetype.strength.split(",").map((item) => item.trim());
  const weaknesses = archetype.weakness.split(",").map((item) => item.trim());

  return (
    <section className="flex min-h-[100svh] w-full items-center justify-center bg-[linear-gradient(162.484deg,#20242f_1.084%,rgba(37,0,24,0.969)_99.188%)] px-5 py-[clamp(5rem,15svh,8rem)]">
      <div className="flex w-full max-w-[19.25rem] items-center">
        <article className="flex min-h-[34rem] w-full flex-col items-center gap-8 rounded-xl border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.2)] px-7 py-9">
          <div className="flex w-full flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h2 className="whitespace-nowrap text-[1.5rem] font-bold leading-6 tracking-[1px] text-[#ffe2e2]">{archetype.name}</h2>
              <div className="flex w-full items-center justify-center gap-1">
                <span className="h-px flex-1 bg-[rgba(255,226,226,0.35)]" />
                <span className="whitespace-nowrap text-[0.875rem] font-medium leading-[0.875rem] tracking-[0.4725px] text-[#ffa1a1]">{archetype.subtitle}</span>
                <span className="h-px flex-1 bg-[rgba(255,226,226,0.35)]" />
              </div>
            </div>
            <span className="h-px w-full bg-[rgba(255,255,255,0.22)]" />
            <p className="text-[0.975rem] font-medium leading-6 tracking-[0.3px] text-[#ffe4e4] [overflow-wrap:anywhere] [word-break:normal]">{archetype.description}</p>
          </div>

          <div className="flex flex-col items-start gap-3">
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex min-h-32 flex-col items-center overflow-hidden rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] pb-4 text-center backdrop-blur-[6px]">
                <p className="w-full border-b border-[rgba(255,255,255,0.16)] bg-[rgba(123,211,174,0.16)] py-3 text-[1rem] font-medium leading-[0.875rem] tracking-[1px] text-[#4adfa1]">강점</p>
                <div className="mt-4 grid w-full gap-2 px-3 text-[0.85rem] font-medium leading-5 tracking-[0.3px] text-[#7bd3ae]">
                  {strengths.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="flex min-h-32 flex-col items-center overflow-hidden rounded border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] pb-4 text-center">
                <p className="w-full border-b border-[rgba(255,255,255,0.16)] bg-[rgba(255,164,100,0.24)] py-3 text-[1rem] font-medium leading-[0.875rem] tracking-[1px] text-[#ff9a56]">약점</p>
                <div className="mt-4 grid w-full gap-2 px-3 text-[0.85rem] font-medium leading-5 tracking-[0.3px] text-[#ffb483]">
                  {weaknesses.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full overflow-hidden rounded border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] text-center">
              <p className="w-full border-b border-[rgba(255,255,255,0.16)] bg-[rgba(255,155,155,0.24)] py-3 text-[1rem] font-medium leading-[0.875rem] tracking-[1px] text-[#ff7e7e]">처방</p>
              <p className="px-4 pb-4 pt-4 text-[0.85rem] font-medium leading-6 tracking-[0.3px] text-[#ff9b9b] [overflow-wrap:anywhere] [word-break:normal]">{archetype.prescription}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function MobileRadarChart({ rows }: { rows: ScoreRow[] }) {
  const orderedRows = RADAR_ORDER.map((id) => rows.find((row) => row.id === id)).filter((row): row is ScoreRow => Boolean(row));
  const size = 220;
  const center = size / 2;
  const radius = 62;
  const topPercent = Math.max(...orderedRows.map((row) => row.percent));
  const points = orderedRows.map((row, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
    const value = clamp(row.percent) / 100;
    return `${center + Math.cos(angle) * radius * value},${center + Math.sin(angle) * radius * value}`;
  });

  return (
    <svg className="h-[220px] w-[220px] overflow-visible" viewBox={`0 0 ${size} ${size}`}>
      {[1, 0.66, 0.33].map((scale) => (
        <circle cx={center} cy={center} fill="none" key={scale} r={radius * scale} stroke="rgba(255,126,126,0.28)" strokeWidth="0.6" />
      ))}
      {orderedRows.map((row, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
        return <line key={row.id} stroke="rgba(177,178,177,0.22)" strokeWidth="0.6" x1={center} x2={center + Math.cos(angle) * radius} y1={center} y2={center + Math.sin(angle) * radius} />;
      })}
      <polygon fill="rgba(232,96,122,0.24)" points={points.join(" ")} stroke="#e8607a" strokeWidth="1.8" />
      {orderedRows.map((row, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / orderedRows.length;
        const isTopCapacity = row.percent === topPercent;
        const x = center + Math.cos(angle) * (radius + 42);
        const y = center + Math.sin(angle) * (radius + 42);
        return (
          <text fill={isTopCapacity ? "#f36b80" : "#7c5050"} fontSize="10.5" fontWeight={isTopCapacity ? 700 : 500} key={row.id} textAnchor="middle" x={x} y={y}>
            {RADAR_SHORT_LABELS[row.id] ?? row.name} ({row.percent}%)
          </text>
        );
      })}
    </svg>
  );
}

function MobileCapacityAnalysisCard({ row }: { row: ScoreRow }) {
  const style = CAPACITY_CARD_STYLES[row.id as Part1CompetencyKey] ?? CAPACITY_CARD_STYLES.abraham;

  return (
    <article className="flex w-full flex-col gap-2.5 rounded-lg border-l-[3px] py-3 pl-4 pr-4 shadow-[0_3px_6px_rgba(0,0,0,0.10)]" style={{ backgroundColor: style.bg, borderLeftColor: style.accent }}>
      <div className="grid gap-2">
        <div className="flex items-start justify-between whitespace-nowrap">
          <strong className="text-xs font-medium leading-5" style={{ color: style.text }}>
            {row.name}
          </strong>
          <span className="text-xs font-bold leading-5" style={{ color: style.text }}>
            {row.percent}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#e2e2e1]">
          <div className="h-full rounded-full" style={{ backgroundColor: style.accent, width: `${clamp(row.percent)}%` }} />
        </div>
      </div>
      <p className="text-xs font-medium leading-5" style={{ color: `${style.text}cc` }}>
        {row.feedback}
      </p>
    </article>
  );
}

function MobileRiskCard({ level, name, subtitle }: { level: string; name: string; subtitle: string }) {
  const isHigh = level === "고위험";
  const isWarning = level === "주의";
  const style = isHigh
    ? { accent: "#cf6e6e", bg: "rgba(207,110,110,0.10)", pill: "rgba(207,110,110,0.30)" }
    : isWarning
      ? { accent: "#e19f5a", bg: "rgba(225,159,90,0.10)", pill: "rgba(225,159,90,0.30)" }
      : { accent: "#5ec497", bg: "rgba(94,196,151,0.10)", pill: "rgba(94,196,151,0.30)" };

  return (
    <article className="flex w-full items-center justify-between rounded-xl border px-4 py-3 shadow-[0_3px_6px_rgba(0,0,0,0.10)]" style={{ backgroundColor: style.bg, borderColor: style.accent }}>
      <div className="grid gap-1 whitespace-nowrap">
        <p className="text-sm font-medium leading-5" style={{ color: style.accent }}>
          {name}
        </p>
        <p className="text-xs font-medium leading-4 text-[#aeaeae]">{subtitle}</p>
      </div>
      <span className="rounded-full px-2 py-1 text-xs font-bold leading-4" style={{ backgroundColor: style.pill, color: style.accent }}>
        {level}
      </span>
    </article>
  );
}

function MobileProfileDonut({ color, percent }: { color: string; percent: number }) {
  const size = 88.2;
  const stroke = 6.3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamp(percent) / 100) * circumference;

  return (
    <div className="relative grid h-[88.2px] w-[89.523px] place-items-center">
      <svg aria-hidden="true" className="-rotate-90" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <circle cx={size / 2} cy={size / 2} fill="none" r={radius} stroke="#f8e9e9" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} fill="none" r={radius} stroke={color} strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" strokeWidth={stroke} />
      </svg>
      <strong className="absolute text-[0.63rem] font-bold leading-[0.63rem] whitespace-nowrap" style={{ color }}>
        {Math.round(percent)}%
      </strong>
    </div>
  );
}

function MobileProfileCard({ row }: { row: ScoreRow & { color: string; english: string; raw: number } }) {
  return (
    <article className="flex aspect-square min-h-40 flex-col items-center justify-center gap-6 rounded-xl border border-[rgba(232,96,122,0.10)] bg-[#fcf8f6] shadow-[0_3px_8px_rgba(154,108,86,0.20)]">
      <MobileProfileDonut color={row.color} percent={row.percent} />
      <div className="text-center">
        <p className="text-xs font-medium leading-4 text-[#b09098]">{row.name}</p>
        <p className="mt-2 text-[0.625rem] font-medium leading-4 text-[rgba(176,144,152,0.8)]">({row.english})</p>
        <p className="mt-4 text-xs font-bold leading-4" style={{ color: row.color }}>
          {row.raw} / 20
        </p>
      </div>
    </article>
  );
}

function MobileResultView({
  archetype,
  capacityScores,
  overall,
  profileScores,
  reset,
  result,
  riskScores,
}: {
  archetype: { description: string; name: string; prescription: string; strength: string; subtitle: string; weakness: string };
  capacityScores: ScoreRow[];
  overall: number;
  profileScores: Array<ScoreRow & { color: string; english: string; raw: number }>;
  reset: () => void;
  result: ReturnType<typeof scoreSurveyAnswers>;
  riskScores: Array<ScoreRow & { level: string; subtitle: string }>;
}) {
  const topCapacity = [...capacityScores].sort((a, b) => b.percent - a.percent)[0];
  const topCapacities = capacityScores.filter((row) => row.percent === topCapacity.percent);
  const topCapacityLabel = topCapacities.map((row) => RADAR_SHORT_LABELS[row.id] ?? row.name).join(" · ");
  const topCapacityLabelClass = topCapacities.length > 1 ? "text-xs leading-5" : "text-sm leading-5";
  const topCapacityStyle = CAPACITY_CARD_STYLES[topCapacity.id as Part1CompetencyKey] ?? CAPACITY_CARD_STYLES.abraham;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white font-sans text-[#312225] md:hidden">
      <div className="absolute left-[-124px] top-[489px] size-[400px] rounded-full bg-[rgba(233,187,134,0.08)] blur-2xl" />
      <div className="absolute left-[254px] top-[172px] size-[260px] rounded-full bg-[rgba(215,111,130,0.06)] blur-2xl" />

      <header className="relative z-10 flex flex-col gap-4 pb-9">
        <div className="w-full" />
        <div className="flex items-center justify-between px-6">
          <div className="grid gap-2">
            <p className="text-[1rem] font-medium leading-4 tracking-[-0.6px] text-[#292524]">복음경제영성 종합 진단</p>
            <p className="text-[0.875rem] font-light leading-[0.875rem] text-black">한국교회 목회지원센터</p>
          </div>
          <details className="relative" onToggle={(event) => setIsMenuOpen(event.currentTarget.open)} open={isMenuOpen}>
            <summary className="flex h-8 w-8 list-none flex-col items-center justify-center gap-[5px] p-1 [&::-webkit-details-marker]:hidden" aria-label="메뉴 열기">
              <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
              <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
              <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
            </summary>
            <div className="absolute right-0 top-[42px] z-50 grid w-40 gap-3 rounded-lg border border-[#f2dada] bg-[rgba(255,247,245,0.96)] p-4 shadow-[0_12px_28px_rgba(97,85,87,0.14)]">
              {RESULT_MOBILE_NAV_ITEMS.map((item) => (
                <Link className="text-sm font-extrabold leading-5 text-[#615557]" href={item.href} key={item.label} onClick={closeMenu}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </header>

      <section className="result-hero relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 pb-[clamp(6rem,16svh,11rem)]">
        <div className="result-hero-content flex flex-col items-center gap-[44.1px]">
          <div className="flex flex-col items-center gap-[18.5px] whitespace-nowrap text-center">
            <p className="text-[0.875rem] font-medium leading-[0.875rem] tracking-[0.77px] text-[#dc657b]">GOSPEL ECONOMIC SPIRITUALITY</p>
            <h1 className="text-[2.75rem] font-bold leading-[2.75rem] text-[#312225]">종합 진단 결과</h1>
          </div>
          <MobileOverallRankCircle grade={result.part1.grade.code} label={result.part1.grade.label} percent={overall} />
        </div>
      </section>

      <MobileEconomicCard archetype={archetype} />

      <section className="relative flex w-full flex-col items-center gap-14 overflow-hidden bg-gradient-to-b from-[#ffedf0] to-[#fff5ee] px-6 py-[clamp(7rem,22svh,12.5rem)]">
        <div className="absolute left-[-0.12px] top-[650px] size-[420px] rotate-[15.69deg] rounded-full bg-[rgba(255,104,104,0.22)] opacity-25 blur-[30px]" />
        <div className="absolute left-[-149px] top-[899px] size-[420px] rotate-[15.69deg] rounded-full bg-[rgba(255,242,64,0.22)] opacity-25 blur-[30px]" />
        <div className="absolute left-[165px] top-[-110px] size-[320px] rounded-full bg-[rgba(255,64,157,0.22)] opacity-25 blur-[30px]" />
        <div className="absolute left-[-119px] top-[164px] size-[360px] rounded-full bg-[rgba(255,217,64,0.22)] opacity-25 blur-[30px]" />
        <MobileSectionTitle title="6대 성경인물 역량 분석" />
        <div className="relative grid w-full gap-5 rounded-2xl border border-[rgba(255,249,249,0.2)] bg-white px-5 py-6 shadow-[0_4px_12px_rgba(208,82,82,0.15)]">
          <div className="grid w-full place-items-center py-5">
            <MobileRadarChart rows={capacityScores} />
          </div>
          <div className="flex w-full items-center justify-between gap-3 rounded-lg border-l-4 py-3 pl-4 pr-3 shadow-[0_3px_6px_rgba(0,0,0,0.10)]" style={{ backgroundColor: topCapacityStyle.bg, borderLeftColor: topCapacityStyle.accent }}>
            <div className="grid min-w-0 gap-1.5">
              <p className="text-xs font-medium leading-4" style={{ color: `${topCapacityStyle.text}b3` }}>
                주요 유형
              </p>
              <p className={`font-bold ${topCapacityLabelClass}`} style={{ color: topCapacityStyle.text }}>
                {topCapacityLabel}
              </p>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold leading-4" style={{ backgroundColor: `${topCapacityStyle.accent}1f`, color: topCapacityStyle.accent }}>
              {topCapacity.percent}% 일치
            </span>
          </div>
        </div>
        <div className="grid w-full gap-3">
          {capacityScores.map((row) => (
            <MobileCapacityAnalysisCard key={row.id} row={row} />
          ))}
        </div>
      </section>

      <section className="relative flex w-full flex-col items-center gap-14 overflow-hidden bg-gradient-to-b from-[#1e1515] to-[#442c3c] px-6 py-[clamp(7rem,22svh,12.5rem)] text-white">
        <div className="absolute left-[-81px] top-[488px] size-[292.8px] rounded-full bg-[rgba(255,68,68,0.30)] opacity-25 blur-[24px]" />
        <div className="absolute left-[101px] top-[101px] size-[292.8px] rotate-[-24.52deg] rounded-full bg-[rgba(162,129,67,0.20)] opacity-25 blur-[24px]" />
        <div className="absolute left-[-21px] top-[-89px] size-[292.8px] rounded-full bg-[radial-gradient(circle_at_52%_66%,rgba(219,71,212,0.5)_0%,rgba(168,54,163,0.25)_50%,rgba(117,38,113,0.1)_100%)] opacity-25 blur-[21px]" />
        <div className="absolute left-[190px] top-[236px] size-[292.8px] rotate-[-24.52deg] rounded-full bg-[rgba(231,65,65,0.20)] opacity-25 blur-[24px]" />
        <div className="absolute left-[167px] top-[800px] size-[292.8px] rounded-full bg-[rgba(213,71,71,0.20)] opacity-25 blur-[18px]" />
        <div className="relative z-10 flex flex-col items-center gap-3 whitespace-nowrap text-center tracking-[1px]">
          <p className="text-[0.875rem] font-medium leading-[0.875rem] text-[#f3b5c1]">GOSPEL ECONOMIC SPIRITUALITY</p>
          <h2 className="text-[1.75rem] font-medium leading-[1.75rem] text-[#ffebeb]">8대 경제장애 위험도</h2>
        </div>
        <div className="relative z-10 grid w-full gap-3">
          {riskScores.map((risk) => (
            <MobileRiskCard key={risk.id} level={risk.level} name={risk.name} subtitle={risk.subtitle} />
          ))}
        </div>
      </section>

      <section className="relative flex w-full flex-col items-center gap-14 overflow-hidden bg-gradient-to-b from-white to-[#fbf9f8] px-6 py-[clamp(7rem,22svh,12.5rem)]">
        <div className="absolute left-[89.8px] top-[-80px] size-[312.32px] rounded-full bg-[rgba(255,101,101,0.22)] opacity-25 blur-[19.2px]" />
        <div className="absolute left-[-131px] top-[48px] size-[312.32px] rounded-full bg-[rgba(197,204,103,0.22)] opacity-25 blur-[19.2px]" />
        <div className="absolute left-[134px] top-[973px] size-[337.4px] rounded-full bg-[rgba(255,125,64,0.22)] opacity-25 blur-[21px]" />
        <div className="absolute left-[-195px] top-[973px] size-[439.6px] rounded-full bg-[rgba(255,64,185,0.22)] opacity-25 blur-[21px]" />
        <div className="absolute left-[213px] top-[431px] size-[235.2px] rounded-full bg-[rgba(255,64,195,0.2)] opacity-25 blur-[12.6px]" />
        <div className="relative z-10 flex flex-col items-center gap-3 whitespace-nowrap text-center tracking-[1px]">
          <p className="text-[0.875rem] font-medium leading-[0.875rem] text-[#f3b5c1]">GOSPEL ECONOMIC SPIRITUALITY</p>
          <h2 className="text-[1.75rem] font-medium leading-[1.75rem] text-[#313332]">MSIG 행동 프로파일</h2>
        </div>
        <p className="relative z-10 w-full text-[0.875rem] font-medium leading-7 tracking-[1px] text-[rgba(96,49,57,0.8)]">
          M(Making) · S(Spending) · I(Investing) · G(Giving) 네 영역이 균형을 이루는 것이 건강한 경제영성의 표지입니다. 가장 낮은 영역부터 개선해나가세요.
        </p>
        <div className="relative z-10 grid w-full grid-cols-2 gap-3">
          {profileScores.map((row) => (
            <MobileProfileCard key={row.id} row={row} />
          ))}
        </div>
      </section>

      <section className="flex min-h-[100svh] w-full flex-col items-center justify-center gap-14 px-6 py-[clamp(6rem,18svh,10rem)] [background-image:radial-gradient(ellipse_at_96%_15%,rgba(235,197,138,0.20)_0%,rgba(235,229,138,0)_42%),radial-gradient(ellipse_at_7%_75%,rgba(255,99,216,0.14)_0%,rgba(255,187,187,0)_38%),linear-gradient(180deg,#fff1f1_0%,#fff7e9_100%)]">
        <div className="grid gap-4 text-center">
          <h2 className="w-full max-w-xs text-[2rem] font-bold leading-[3rem] text-[#583439]">진단이 완료되었습니다</h2>
          <p className="text-[0.875rem] font-medium leading-[0.875rem] tracking-[0.4px] text-[#615557]">결과를 저장하거나 전문가와 함께 더 깊이 나눠보세요</p>
        </div>
        <div className="grid w-full max-w-[18rem] gap-5 print:hidden">
          <a className="result-action-button inline-flex h-11 items-center justify-center gap-2.5 overflow-hidden rounded bg-[linear-gradient(163.147deg,#d47182_30.726%,#e68798_66.995%)] text-[0.875rem] font-medium leading-[0.875rem] text-white shadow-[0_8px_12px_-2.4px_rgba(140,71,82,0.2),0_3.2px_4.8px_-3.2px_rgba(140,71,82,0.2)]" href="mailto:contact@example.com?subject=MSIG%20상담%20신청" style={{ color: "#fff" }}>
            <svg aria-hidden="true" className="h-[14.4px] w-4 shrink-0" fill="none" viewBox="0 0 16 14.4">
              <path d="M2.4 8.6V6.5a5.6 5.6 0 0 1 11.2 0v2.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
              <path d="M2.4 8.2a1.6 1.6 0 0 1 1.6-1.6h.8v4H4a1.6 1.6 0 0 1-1.6-1.6v-.8ZM13.6 8.2A1.6 1.6 0 0 0 12 6.6h-.8v4h.8a1.6 1.6 0 0 0 1.6-1.6v-.8Z" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.9 12.2H8.7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
            상담 · 코칭 신청하기
          </a>
          <button className="inline-flex h-11 items-center justify-center gap-1.5 overflow-hidden rounded bg-[linear-gradient(277.653deg,#7d545b_1.526%,#664349_99.86%)] px-4 text-[0.75rem] font-medium leading-[0.75rem] text-white shadow-[0_8px_12px_-2.4px_rgba(81,44,50,0.2),0_3.2px_4.8px_-3.2px_rgba(81,44,50,0.2)]" onClick={() => window.print()} type="button">
            <svg aria-hidden="true" className="size-[14px] shrink-0" fill="none" viewBox="0 0 16 16">
              <path d="M3 2.5h7.2L13 5.3v8.2H3V2.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
              <path d="M10.2 2.5v2.8H13" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
              <path d="M5.1 7.1h5.8M5.1 9.4h5.8M5.1 11.7h3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
            </svg>
            <span className="whitespace-nowrap text-[0.75rem] font-medium leading-[0.75rem]">결과지 인쇄하기 / PDF 다운받기</span>
          </button>
          <Link className="inline-flex h-11 items-center justify-center gap-2.5 overflow-hidden rounded bg-[linear-gradient(276.612deg,#ffe1e1_0.173%,#ffcaca_99.823%)] px-6 text-[0.875rem] font-medium leading-[0.875rem] text-[#1f1a1b] shadow-[0_8px_12px_-2.4px_rgba(151,110,110,0.2),0_3.2px_4.8px_-3.2px_rgba(151,110,110,0.2)]" href="/diagnosis" onClick={reset}>
            <svg aria-hidden="true" className="size-[14px] shrink-0" fill="none" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M3 3v5h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            다시 진단하기
          </Link>
        </div>
      </section>

      <footer className="w-full bg-[#423739] px-6 pb-12 pt-5 text-white">
        <div className="grid gap-3 text-[0.5rem] font-light leading-3">
          <p className="text-[0.75rem] font-medium leading-3">한국목회지원센터</p>
          <p>서울 강남구 OO로 OO길 OO타워 OO호</p>
          <p>TEL: 010-0000-0000</p>
          <p>copyright (c) (사)한국목회지원회 All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export function ResultView() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [profile, setProfile] = useState<Profile>({ name: "", church: "" });
  const [hasLoadedStoredResult, setHasLoadedStoredResult] = useState(false);

  useEffect(() => {
    setAnswers(loadJson<SurveyAnswers>(STORAGE_KEYS.answers, {}, STORAGE_KEYS.legacyAnswers));
    setProfile(loadJson<Profile>(STORAGE_KEYS.profile, { name: "", church: "" }, STORAGE_KEYS.legacyProfile));
    setHasLoadedStoredResult(true);
  }, []);

  useEffect(() => {
    window.history.pushState({ ...window.history.state, msigResultGuard: true }, "", window.location.href);

    const handlePopState = () => {
      window.alert(RESULT_BACK_WARNING);
      router.push("/diagnosis/info");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  const result = useMemo(() => scoreSurveyAnswers(answers), [answers]);
  const totalAnswered = SURVEY_QUESTIONS.filter((question) => answers[question.id]).length;
  const overall = Math.round(result.part1.percentage);
  const capacityScores = (Object.entries(result.part1.competencies) as Array<[Part1CompetencyKey, (typeof result.part1.competencies)[Part1CompetencyKey]]>).map(([key, score]) => {
    const percent = Math.round(score.percentage);
    const label = COMPETENCY_LABELS[key];
    return {
      id: key,
      name: label.name,
      percent,
      feedback: percent >= 50 ? label.high : label.low,
    };
  });
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
  const topCapacity = [...capacityScores].sort((a, b) => b.percent - a.percent)[0];
  const topCapacities = capacityScores.filter((row) => row.percent === topCapacity.percent);
  const topCapacityLabel = topCapacities.map((row) => RADAR_SHORT_LABELS[row.id] ?? row.name).join(" · ");
  const topCapacityStyle = CAPACITY_CARD_STYLES[topCapacity.id as Part1CompetencyKey] ?? CAPACITY_CARD_STYLES.abraham;
  const weakestCapacity = [...capacityScores].sort((a, b) => a.percent - b.percent)[0];

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEYS.answers);
    window.localStorage.removeItem(STORAGE_KEYS.profile);
    window.localStorage.removeItem(STORAGE_KEYS.legacyAnswers);
    window.localStorage.removeItem(STORAGE_KEYS.legacyProfile);
    window.localStorage.removeItem(STORAGE_KEYS.partIndex);
  };

  if (!hasLoadedStoredResult) {
    return <main className="min-h-screen bg-[#fff7f5]" aria-label="결과 불러오는 중" />;
  }

  if (totalAnswered < SURVEY_QUESTIONS.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff7f5] px-6 py-10">
        <div className="grid max-w-[520px] gap-4 rounded-lg border border-[#efdfdf] bg-[rgba(255,255,255,0.86)] p-6 shadow-[0_14px_38px_rgba(140,71,82,0.09)]">
          <p className="text-[0.8125rem] font-black uppercase text-[#e8667a]">결과 준비 전</p>
          <h1 className="text-[1.625rem] font-extrabold leading-[1.2] text-[#423739] md:text-[2.5rem]">완료된 설문 응답이 없습니다.</h1>
          <p className="text-[0.9375rem] leading-[1.7] text-[#78716c] md:text-base">
            현재 저장된 응답은 {totalAnswered}/{SURVEY_QUESTIONS.length}문항입니다. 모든 문항에 응답한 뒤 결과가 생성됩니다.
          </p>
          <Link className="inline-flex min-h-[46px] items-center justify-center rounded-md bg-[#e8667a] px-[18px] font-extrabold text-white transition hover:-translate-y-px" href="/diagnosis/info">
            진단 시작하기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <MobileResultView archetype={archetype} capacityScores={capacityScores} overall={overall} profileScores={profileScores} reset={reset} result={result} riskScores={riskScores} />
      <main className="hidden overflow-hidden bg-[#fbf9f8] font-sans text-[#312225] md:block">
        <section className="result-hero relative flex h-dvh max-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#fbf9f8] px-[60px] py-[80px]">
          <div className="pointer-events-none absolute -left-20 -top-3 size-[348px] rotate-[-25deg] rounded-full bg-[rgba(255,170,51,0.22)] opacity-25 blur-[21px]" />
          <div className="pointer-events-none absolute left-[63%] top-[-217px] size-[583px] rounded-full bg-[rgba(255,64,68,0.22)] opacity-25 blur-[30px]" />
          <div className="result-hero-content relative z-10 flex flex-col items-center gap-[60px]">
            <div className="flex flex-col items-center justify-center gap-[25.2px] whitespace-nowrap text-center">
              <p className="text-[1.3125rem] font-medium uppercase leading-[1.05rem] tracking-[1.05px] text-[#dc657b]">GOSPEL ECONOMIC SPIRITUALITY</p>
              <h2 className="text-[3.75rem] font-bold leading-[3.75rem] text-[#312225]">종합 진단 결과</h2>
            </div>

            <OverallRankCircle grade={result.part1.grade.code} label={result.part1.grade.label} percent={overall} />
          </div>
        </section>

        {/* 섹션2 */}
        <section className="grid min-h-dvh place-items-center overflow-hidden bg-[#fbf9f8] px-6 py-[40px] xl:px-[60px]">
          <article className="relative z-10 flex w-full max-w-[1106px] overflow-hidden rounded-[14px] border border-[rgba(104,41,41,0.2)] bg-[linear-gradient(146.73deg,#fffdfd_0%,#fff6eb_99%)] shadow-[0_4px_12px_rgba(110,25,25,0.15)]">
            <div className="flex min-w-0 flex-1 items-center self-stretch pr-0">
              <div className="flex h-full w-full min-w-0 flex-col justify-center px-8 py-8 xl:px-12 xl:py-10">
                <div className="flex w-full min-w-0 flex-col gap-10 xl:gap-[63px]">
                  <div className="flex w-full min-w-0 flex-col gap-6 xl:gap-[37.8px]">
                    <div className="grid justify-start gap-[10.5px]">
                      <h3 className="text-[2.625rem] font-bold leading-[2.625rem] tracking-[2.1px] text-[#432424]">{archetype.name}</h3>
                      <div className="flex w-full items-center justify-center gap-[8.4px]">
                        <span className="h-px flex-1 bg-[rgba(96,49,57,0.55)]" />
                        <span className="text-[1.3125rem] font-medium leading-[1.3125rem] tracking-[0.4725px] text-[rgba(64,55,55,0.8)]">{archetype.subtitle}</span>
                        <span className="h-px flex-1 bg-[rgba(96,49,57,0.55)]" />
                      </div>
                    </div>
                    <p className="max-w-[600px] text-[1rem] font-medium leading-7 tracking-[0.4px] text-[rgba(64,55,55,0.8)] xl:text-[1.05rem] xl:leading-[1.70625rem] xl:tracking-[1.05px]">{archetype.description}</p>
                  </div>

                  <div className="flex w-full flex-col gap-9 pt-[10.5px]">
                    <span className="h-px w-full bg-[#e8d3d0]" />
                    <div className="flex w-full flex-col gap-[21px]">
                      <DesktopTraitRow icon="↗" items={archetype.strength.split(",").map((item) => item.trim())} title="강점" tone="green" />
                      <DesktopTraitRow icon="◇" items={archetype.weakness.split(",").map((item) => item.trim())} title="약점" tone="orange" />
                      <div className="flex w-full items-center gap-5 rounded-[4.2px] bg-[#fff4f4] max-[1210px]:p-4 xl:gap-[54.6px]">
                        <div className="flex self-stretch">
                          <div className="flex h-full items-center gap-3 xl:gap-[16.8px]">
                            <span className="grid min-h-16 w-16 place-items-center rounded-[5.6px] bg-[#ffe0e0] text-[1.625rem] font-medium text-[#b03030] xl:min-h-[74.2px] xl:w-[74.2px]">✚</span>
                            <strong className="text-base font-medium leading-5 tracking-[0.4px] text-[#b03030] xl:text-[1.18125rem] xl:leading-[1.18125rem] xl:tracking-[1.05px]">처방</strong>
                          </div>
                        </div>
                        <p className="min-w-0 flex-1 text-sm font-medium leading-6 tracking-[0.4px] text-[rgba(176,48,48,0.8)] xl:py-[14px] xl:pr-[42px] xl:text-[0.91875rem] xl:leading-[1.44375rem] xl:tracking-[1.05px]">{archetype.prescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="flex shrink-0 items-center overflow-hidden rounded-r-[14px] bg-[linear-gradient(167.65deg,#20242f_1%,rgba(37,0,24,0.969)_99%)] p-5 xl:p-[42px]">
              <div className="flex w-[270px] flex-col items-center gap-7 rounded-[14px] border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.2)] px-6 py-8 xl:w-[346px] xl:gap-[36.4px] xl:px-[33.6px] xl:py-[42px]">
                <div className="flex flex-col items-center gap-3 text-center tracking-[0.315px]">
                  <p className="text-[0.875rem] font-medium leading-[0.875rem] text-[#ffdede]">ECONOMIC TYPE</p>
                  <p className="text-[1.5rem] font-medium leading-[1.5rem] text-[#ffa1a1]">나의 경제유형</p>
                </div>
                <div className="flex flex-col items-center gap-[25.2px]">
                  <div className="bg-[#2a2e3b] p-[7px]">
                    <div className="grid h-[292px] w-[220px] place-items-center overflow-hidden rounded-[2.352px] border border-[rgba(214,204,205,0.1)] bg-[#1f222b] xl:h-[351.071px] xl:w-[264.813px]">
                      <img alt={`${archetype.name} 이미지`} className="h-full w-full object-cover object-top" src={archetype.image} />
                    </div>
                  </div>
                  <div className="grid justify-items-center gap-[7px]">
                    <strong className="text-[1.75rem] font-bold leading-[1.75rem] tracking-[1.4px] text-[#ffe2e2]">{archetype.name}</strong>
                    <div className="flex w-full items-center justify-center gap-[5.6px]">
                      <span className="h-px flex-1 bg-[rgba(198,198,198,0.42)]" />
                      <span className="text-[0.875rem] font-medium leading-[0.875rem] tracking-[0.315px] text-[rgba(198,198,198,0.8)]">{archetype.subtitle}</span>
                      <span className="h-px flex-1 bg-[rgba(198,198,198,0.42)]" />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </article>
        </section>

        <section className="relative grid h-dvh max-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-[#ffedf0] to-[#fff5ee] px-6 py-10 xl:px-[60px]">
          <div className="pointer-events-none absolute left-[174px] top-[1031px] size-[488px] rounded-full bg-[rgba(255,104,104,0.22)] opacity-25 blur-[30px]" />
          <div className="pointer-events-none absolute left-[900px] top-[530px] size-[488px] rounded-full bg-[rgba(255,242,64,0.22)] opacity-25 blur-[30px]" />
          <div className="pointer-events-none absolute left-[705px] top-[37px] size-[488px] rounded-full bg-[rgba(255,64,157,0.22)] opacity-25 blur-[30px]" />
          <div className="pointer-events-none absolute left-[-70px] top-[304px] size-[488px] rounded-full bg-[rgba(255,217,64,0.22)] opacity-25 blur-[30px]" />
          <div className="relative z-10 grid w-full max-w-[1280px] grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] items-start gap-8 xl:gap-[72px]">
            <div className="flex flex-col items-start gap-9">
              <div className="flex flex-col items-start gap-4 tracking-[1px]">
                <p className="text-[1.25rem] font-medium uppercase leading-8 text-[#cf7989]">GOSPEL ECONOMIC SPIRITUALITY</p>
                <h2 className="whitespace-nowrap text-[3rem] font-medium leading-[3rem] text-[#533030]">6대 성경인물 역량 분석</h2>
              </div>
              <div className="flex w-full flex-col items-start gap-6 rounded-[20px] bg-white px-6 py-7 shadow-[0_4px_12px_rgba(255,159,159,0.15)] xl:px-10">
                <div className="grid w-full place-items-center">
                  <RadarChart rows={capacityScores} />
                </div>
                <div className="flex w-full items-center justify-between rounded-[12px] border-l-4 py-5 pl-9 pr-8 shadow-[0_4px_4px_rgba(0,0,0,0.10)]" style={{ backgroundColor: topCapacityStyle.bg, borderLeftColor: topCapacityStyle.accent }}>
                  <div className="grid gap-3">
                    <p className="text-[1.125rem] font-medium leading-[1.125rem]" style={{ color: `${topCapacityStyle.text}b3` }}>
                      주요 유형
                    </p>
                    <p className="text-[1rem] font-bold leading-6" style={{ color: topCapacityStyle.text }}>
                      {topCapacityLabel}
                    </p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[1rem] font-bold leading-6" style={{ backgroundColor: `${topCapacityStyle.accent}1f`, color: topCapacityStyle.accent }}>
                    {topCapacity.percent}% 일치
                  </span>
                </div>
              </div>
            </div>

            <div className="grid min-w-0 content-start gap-4">
              {capacityScores.map((row) => (
                <CapacityAnalysisCard key={row.id} row={row} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative grid h-dvh max-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-[#1e1515] to-[#442c3c] px-[60px] py-[80px] text-white">
          <div className="pointer-events-none absolute left-[-159px] top-[-57px] size-[488px] rounded-full bg-[rgba(255,64,101,0.10)] blur-[80px]" />
          <div className="pointer-events-none absolute left-[544px] top-[-231px] size-[488px] rounded-full bg-[rgba(212,120,216,0.10)] blur-[75px]" />
          <div className="pointer-events-none absolute left-[794px] top-[163px] size-[488px] rotate-[35deg] rounded-full bg-[rgba(197,107,64,0.10)] blur-[80px]" />
          <div className="pointer-events-none absolute left-[942px] top-[388px] size-[488px] rounded-full bg-[rgba(255,64,64,0.10)] blur-[80px]" />
          <div className="pointer-events-none absolute left-[116px] top-[662px] size-[488px] rounded-full bg-[rgba(255,64,101,0.08)] blur-[90px]" />
          <div className="relative z-10 mx-auto grid w-full max-w-[1160px] gap-[80px]">
            <div className="flex flex-col items-start gap-4 tracking-[1px]">
              <p className="text-[1.25rem] font-medium uppercase leading-8 text-[#f3b5c1]">GOSPEL ECONOMIC SPIRITUALITY</p>
              <h2 className="text-[3rem] font-medium leading-[3rem] text-[#ffebeb]">8대 경제장애 위험도</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-[60px] gap-y-6">
              {riskScores.map((risk) => (
                <RiskCard key={risk.id} level={risk.level} name={risk.name} subtitle={risk.subtitle} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative grid h-dvh max-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-white to-[#fbf9f8] px-[60px] py-[80px]">
          <div className="pointer-events-none absolute left-[176px] top-[-65px] size-[390px] rounded-full bg-[rgba(255,101,101,0.22)] opacity-25 blur-[24px]" />
          <div className="pointer-events-none absolute left-[-100px] top-[95px] size-[390px] rounded-full bg-[rgba(197,204,103,0.22)] opacity-25 blur-[24px]" />
          <div className="pointer-events-none absolute left-[841px] top-[766px] size-[482px] rounded-full bg-[rgba(255,125,64,0.22)] opacity-25 blur-[30px]" />
          <div className="pointer-events-none absolute left-[-148px] top-[905px] size-[628px] rounded-full bg-[rgba(255,64,185,0.22)] opacity-25 blur-[30px]" />
          <div className="pointer-events-none absolute left-[850px] top-[-264px] size-[560px] rounded-full bg-[rgba(255,64,195,0.2)] opacity-25 blur-[30px]" />
          <div className="relative z-10 mx-auto grid w-full max-w-[1160px] gap-[72px]">
            <div className="flex w-full flex-col items-start gap-4 tracking-[1px]">
              <p className="text-[1.25rem] font-medium leading-8 text-[#f3b5c1]">GOSPEL ECONOMIC SPIRITUALITY</p>
              <h2 className="text-[3rem] font-medium leading-[3rem] text-[#313332]">MSIG 행동 프로파일</h2>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {profileScores.map((row) => (
                <article className="flex h-[336px] flex-col items-center justify-center gap-10 rounded-[11.2px] border border-[rgba(232,96,122,0.10)] bg-[#fcf8f6] shadow-[0_4px_12px_rgba(154,108,86,0.20)]" key={row.id}>
                  <ScoreDonut color={row.color} percent={row.percent} />
                  <div className="flex w-full flex-col items-center gap-[25.2px] text-center">
                    <div className="flex flex-col items-center gap-[11.2px]">
                      <p className="text-[1.225rem] font-medium leading-[1.225rem] text-[#b09098]">{row.name}</p>
                      <p className="text-[1.05rem] font-medium leading-[1.05rem] text-[rgba(176,144,152,0.8)]">({row.english})</p>
                    </div>
                    <p className="text-[1.225rem] font-bold leading-[1.225rem]" style={{ color: row.color }}>
                      {row.raw} / 20
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className="text-[1.5rem] font-medium leading-[2.75rem] tracking-[1px] text-[rgba(96,49,57,0.8)]">
              M(Making)·S(Spending)·I(Investing)·G(Giving) 네 영역이 균형을 이루는 것이 건강한 경제영성의 표지입니다. 가장 낮은 영역부터 개선해나가세요.
            </p>
          </div>
        </section>

        <section className="flex h-dvh max-h-dvh flex-col items-center justify-center overflow-hidden px-[60px] py-[100px] [background-image:radial-gradient(ellipse_at_96%_15%,rgba(235,197,138,0.20)_0%,rgba(235,229,138,0)_42%),radial-gradient(ellipse_at_7%_75%,rgba(255,99,216,0.14)_0%,rgba(255,187,187,0)_38%),linear-gradient(180deg,#fff1f1_0%,#fff7e9_100%)]">
          <div className="flex w-full max-w-[1160px] flex-col items-center justify-center gap-[72px] border-t border-[rgba(177,178,177,0.1)] pb-12 pt-[81px]">
            <div className="flex flex-col items-center gap-8 whitespace-nowrap text-center">
              <h2 className="text-[3.75rem] font-bold leading-[3.75rem] text-[#362f30]">진단을 마치셨습니다</h2>
              <p className="text-[1.5rem] font-medium leading-6 tracking-[0.4px] text-[#615557]">결과를 저장하거나 전문가와 함께 더 깊이 나눠보세요</p>
            </div>
            <div className="grid w-[359px] gap-6 print:hidden">
              <a className="result-action-button inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded bg-[linear-gradient(163.15deg,#d47182_30.73%,#e68798_67%)] px-8 py-4 text-[1.125rem] font-medium leading-[1.125rem] text-white shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)]" href="mailto:contact@example.com?subject=MSIG%20상담%20신청" style={{ color: "#fff" }}>
                <span aria-hidden="true" className="text-[1.125rem] leading-none">☊</span>
                상담 · 코칭 신청하기
              </a>
              <button className="inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded bg-[linear-gradient(277.65deg,#7d545b_1.53%,#664349_99.86%)] px-8 py-4 text-[1.125rem] font-medium leading-[1.125rem] text-white shadow-[0_10px_15px_-3px_rgba(81,44,50,0.2),0_4px_6px_-4px_rgba(81,44,50,0.2)]" onClick={() => window.print()} type="button">
                <span aria-hidden="true" className="text-[1.125rem] leading-none">▣</span>
                결과지 인쇄하기 / PDF 다운받기
              </button>
              <Link className="inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded bg-[linear-gradient(276.61deg,#ffe1e1_0.17%,#ffcaca_99.82%)] px-8 py-4 text-[1.125rem] font-medium leading-[1.125rem] text-[#1f1a1b] shadow-[0_10px_15px_-3px_rgba(151,110,110,0.2),0_4px_6px_-4px_rgba(151,110,110,0.2)]" href="/diagnosis" onClick={reset}>
                <span aria-hidden="true" className="text-[1.125rem] leading-none">↻</span>
                다시 진단하기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
