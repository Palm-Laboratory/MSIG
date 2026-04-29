export type SurveyAnswer = 1 | 2 | 3 | 4 | 5;
export type SurveyAnswers = Record<number, SurveyAnswer>;

export type GradeCode = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";
export type GradeLabel = "탁월" | "우수" | "양호" | "보통" | "주의" | "경고" | "위험";
export type RiskLevel = "양호" | "주의" | "고위험";

export type Score = {
  rawScore: number;
  maxScore: number;
  percentage: number;
};

export type Part1CompetencyKey =
  | "abraham"
  | "david"
  | "joseph"
  | "nehemiah"
  | "samson"
  | "daniel";

export type Part2RiskKey =
  | "esau"
  | "ahab"
  | "ananias"
  | "achan"
  | "richFool"
  | "solomon"
  | "oneTalentServant"
  | "martha";

export type Part3ProfileKey = "making" | "spending" | "investing" | "giving";

export type Part1Score = Score & {
  grade: {
    code: GradeCode;
    label: GradeLabel;
  };
  competencies: Record<Part1CompetencyKey, Score>;
};

export type RiskScore = Score & {
  level: RiskLevel;
};

export type Part2Score = {
  risks: Record<Part2RiskKey, RiskScore>;
};

export type ProfileScore = Score & {
  name: string;
};

export type Part3Score = {
  profile: Record<Part3ProfileKey, ProfileScore>;
  lowestArea: ProfileScore & {
    key: Part3ProfileKey;
  };
};

export type EconomicArchetype = {
  name: string;
  subtitle: string;
};

export type SurveyScoreResult = {
  part1: Part1Score;
  part2: Part2Score;
  part3: Part3Score;
  economicArchetype: EconomicArchetype;
};

type GroupDefinition<Key extends string> = {
  key: Key;
  name?: string;
  start: number;
  end: number;
};

const PART1_GROUPS: readonly GroupDefinition<Part1CompetencyKey>[] = [
  { key: "abraham", start: 1, end: 7 },
  { key: "david", start: 8, end: 13 },
  { key: "joseph", start: 14, end: 20 },
  { key: "nehemiah", start: 21, end: 26 },
  { key: "samson", start: 27, end: 33 },
  { key: "daniel", start: 34, end: 40 },
];

const PART2_GROUPS: readonly GroupDefinition<Part2RiskKey>[] = [
  { key: "esau", start: 41, end: 43 },
  { key: "ahab", start: 44, end: 46 },
  { key: "ananias", start: 47, end: 49 },
  { key: "achan", start: 50, end: 52 },
  { key: "richFool", start: 53, end: 55 },
  { key: "solomon", start: 56, end: 58 },
  { key: "oneTalentServant", start: 59, end: 61 },
  { key: "martha", start: 62, end: 64 },
];

const PART3_GROUPS: readonly GroupDefinition<Part3ProfileKey>[] = [
  { key: "making", name: "Making", start: 65, end: 68 },
  { key: "spending", name: "Spending", start: 69, end: 72 },
  { key: "investing", name: "Investing", start: 73, end: 76 },
  { key: "giving", name: "Giving", start: 77, end: 80 },
];

const scorePercent = (rawScore: number, maxScore: number) =>
  (rawScore / maxScore) * 100;

const answerFor = (answers: SurveyAnswers, id: number) => answers[id] ?? 0;

const scoreRange = (
  answers: SurveyAnswers,
  start: number,
  end: number,
  reverseScore = false,
) => {
  let rawScore = 0;

  for (let id = start; id <= end; id += 1) {
    const value = answerFor(answers, id);
    rawScore += reverseScore && value > 0 ? 6 - value : value;
  }

  const maxScore = (end - start + 1) * 5;
  return {
    rawScore,
    maxScore,
    percentage: scorePercent(rawScore, maxScore),
  };
};

const gradeForPart1 = (rawScore: number): Part1Score["grade"] => {
  if (rawScore >= 180) return { code: "A+", label: "탁월" };
  if (rawScore >= 160) return { code: "A", label: "우수" };
  if (rawScore >= 140) return { code: "B+", label: "양호" };
  if (rawScore >= 120) return { code: "B", label: "보통" };
  if (rawScore >= 100) return { code: "C", label: "주의" };
  if (rawScore >= 80) return { code: "D", label: "경고" };
  return { code: "F", label: "위험" };
};

const riskLevelFor = (rawScore: number): RiskLevel => {
  if (rawScore >= 11) return "고위험";
  if (rawScore >= 8) return "주의";
  return "양호";
};

const classifyEconomicArchetype = (
  competencies: Record<Part1CompetencyKey, Score>,
  overallPercentage: number,
): EconomicArchetype => {
  if (competencies.abraham.percentage >= 80 && overallPercentage >= 70) {
    return { name: "아브라함형", subtitle: "믿음의 모험가" };
  }

  if (
    competencies.joseph.percentage >= 80 &&
    competencies.nehemiah.percentage >= 70 &&
    overallPercentage < 50
  ) {
    return { name: "나발형", subtitle: "수전노" };
  }

  if (
    competencies.nehemiah.percentage >= 80 &&
    competencies.joseph.percentage >= 70
  ) {
    return { name: "야곱형", subtitle: "전략적 사냥꾼" };
  }

  if (
    competencies.abraham.percentage < 50 &&
    competencies.samson.percentage < 50
  ) {
    return { name: "발람형", subtitle: "물질 숭배 경계형" };
  }

  if (competencies.david.percentage < 40 && overallPercentage < 50) {
    return { name: "엘리야형", subtitle: "지친 전사" };
  }

  if (
    competencies.samson.percentage < 40 &&
    competencies.nehemiah.percentage < 50
  ) {
    return { name: "아간형", subtitle: "일확천금 추구" };
  }

  if (
    competencies.joseph.percentage < 40 &&
    competencies.samson.percentage < 50
  ) {
    return { name: "탕자형", subtitle: "낭비가" };
  }

  if (overallPercentage < 40) {
    return { name: "므비보셋형", subtitle: "경제적 미성숙" };
  }

  if (overallPercentage >= 65) {
    return { name: "아브라함형", subtitle: "믿음의 모험가" };
  }

  if (competencies.nehemiah.percentage >= 65) {
    return { name: "야곱형", subtitle: "전략적 사냥꾼" };
  }

  return { name: "엘리야형", subtitle: "지친 전사" };
};

export const scoreSurveyAnswers = (
  answers: SurveyAnswers,
): SurveyScoreResult => {
  const competencies = Object.fromEntries(
    PART1_GROUPS.map(({ key, start, end }) => [
      key,
      scoreRange(answers, start, end, key === "samson"),
    ]),
  ) as Record<Part1CompetencyKey, Score>;

  const part1RawScore = Object.values(competencies).reduce(
    (sum, score) => sum + score.rawScore,
    0,
  );
  const part1MaxScore = 200;
  const part1Percentage = scorePercent(part1RawScore, part1MaxScore);

  const part1: Part1Score = {
    rawScore: part1RawScore,
    maxScore: part1MaxScore,
    percentage: part1Percentage,
    grade: gradeForPart1(part1RawScore),
    competencies,
  };

  const risks = Object.fromEntries(
    PART2_GROUPS.map(({ key, start, end }) => {
      const score = scoreRange(answers, start, end);
      return [key, { ...score, level: riskLevelFor(score.rawScore) }];
    }),
  ) as Record<Part2RiskKey, RiskScore>;

  const profileEntries = PART3_GROUPS.map(({ key, name, start, end }) => {
    const score = scoreRange(answers, start, end);
    return [key, { ...score, name: name ?? key }] as const;
  });
  const profile = Object.fromEntries(profileEntries) as Record<
    Part3ProfileKey,
    ProfileScore
  >;
  const lowestArea = profileEntries.reduce(
    (lowest, current) =>
      current[1].rawScore < lowest[1].rawScore ? current : lowest,
    profileEntries[0],
  );

  return {
    part1,
    part2: { risks },
    part3: {
      profile,
      lowestArea: {
        key: lowestArea[0],
        ...lowestArea[1],
      },
    },
    economicArchetype: classifyEconomicArchetype(
      competencies,
      part1Percentage,
    ),
  };
};
