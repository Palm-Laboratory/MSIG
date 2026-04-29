import { describe, expect, it } from "vitest";

import { scoreSurveyAnswers } from "./scoring";

type Answers = Record<number, 1 | 2 | 3 | 4 | 5>;

const ALL_QUESTION_IDS = Array.from({ length: 80 }, (_, index) => index + 1);
const SAMSON_QUESTION_IDS = [27, 28, 29, 30, 31, 32, 33];

function answersWith(defaultAnswer: 1 | 2 | 3 | 4 | 5 = 3): Answers {
  return Object.fromEntries(
    ALL_QUESTION_IDS.map((id) => [id, defaultAnswer]),
  ) as Answers;
}

function setRange(
  answers: Answers,
  start: number,
  end: number,
  value: 1 | 2 | 3 | 4 | 5,
): Answers {
  for (let id = start; id <= end; id += 1) {
    answers[id] = value;
  }

  return answers;
}

function setValues(
  answers: Answers,
  start: number,
  values: Array<1 | 2 | 3 | 4 | 5>,
): Answers {
  values.forEach((value, offset) => {
    answers[start + offset] = value;
  });

  return answers;
}

function answersWithPart1ScoredRawScore(rawScore: number): Answers {
  const answers = answersWith(1);
  let remainingExtraPoints = rawScore - 40;

  if (remainingExtraPoints < 0 || remainingExtraPoints > 160) {
    throw new Error(`Part 1 raw score out of range: ${rawScore}`);
  }

  for (let id = 1; id <= 40; id += 1) {
    const extraPoints = Math.min(4, remainingExtraPoints);
    const scoredValue = (1 + extraPoints) as 1 | 2 | 3 | 4 | 5;
    answers[id] = SAMSON_QUESTION_IDS.includes(id)
      ? ((6 - scoredValue) as 1 | 2 | 3 | 4 | 5)
      : scoredValue;
    remainingExtraPoints -= extraPoints;
  }

  return answers;
}

describe("scoreSurveyAnswers", () => {
  it("reverse-scores Samson questions 27-33 before computing Part 1 scores", () => {
    const result = scoreSurveyAnswers(answersWith(5));

    expect(result.part1.competencies.samson.rawScore).toBe(7);
    expect(result.part1.competencies.samson.percentage).toBe(20);
    expect(result.part1.rawScore).toBe(172);
    expect(result.part1.percentage).toBe(86);
  });

  it.each([
    [78, "F", "위험"],
    [80, "D", "경고"],
    [98, "D", "경고"],
    [100, "C", "주의"],
    [118, "C", "주의"],
    [120, "B", "보통"],
    [138, "B", "보통"],
    [140, "B+", "양호"],
    [158, "B+", "양호"],
    [160, "A", "우수"],
    [178, "A", "우수"],
    [180, "A+", "탁월"],
  ])(
    "assigns grade %s raw Part 1 points to %s",
    (rawScore, grade, label) => {
      const result = scoreSurveyAnswers(
        answersWithPart1ScoredRawScore(rawScore),
      );

      expect(result.part1.rawScore).toBe(rawScore);
      expect(result.part1.grade.code).toBe(grade);
      expect(result.part1.grade.label).toBe(label);
    },
  );

  it("computes Part 1 competency scores, percentages, and overall grade", () => {
    const answers = answersWith(1);

    setRange(answers, 1, 7, 4);
    setRange(answers, 8, 13, 5);
    setRange(answers, 14, 20, 3);
    setRange(answers, 21, 26, 2);
    setRange(answers, 27, 33, 1);
    setRange(answers, 34, 40, 5);

    const result = scoreSurveyAnswers(answers);

    expect(result.part1.competencies.abraham).toMatchObject({
      rawScore: 28,
      maxScore: 35,
      percentage: 80,
    });
    expect(result.part1.competencies.david).toMatchObject({
      rawScore: 30,
      maxScore: 30,
      percentage: 100,
    });
    expect(result.part1.competencies.joseph).toMatchObject({
      rawScore: 21,
      maxScore: 35,
      percentage: 60,
    });
    expect(result.part1.competencies.nehemiah).toMatchObject({
      rawScore: 12,
      maxScore: 30,
      percentage: 40,
    });
    expect(result.part1.competencies.samson).toMatchObject({
      rawScore: 35,
      maxScore: 35,
      percentage: 100,
    });
    expect(result.part1.competencies.daniel).toMatchObject({
      rawScore: 35,
      maxScore: 35,
      percentage: 100,
    });
    expect(result.part1).toMatchObject({
      rawScore: 161,
      maxScore: 200,
      percentage: 80.5,
    });
    expect(result.part1.grade).toMatchObject({ code: "A", label: "우수" });
  });

  it("classifies the economic archetype using the documented priority order", () => {
    const answers = answersWith(1);

    setRange(answers, 1, 7, 4);
    setRange(answers, 8, 13, 3);
    setRange(answers, 14, 20, 5);
    setRange(answers, 21, 26, 5);
    setRange(answers, 27, 33, 3);
    setRange(answers, 34, 40, 3);

    const result = scoreSurveyAnswers(answers);

    expect(result.part1.competencies.abraham.percentage).toBe(80);
    expect(result.part1.competencies.nehemiah.percentage).toBe(100);
    expect(result.part1.competencies.joseph.percentage).toBe(100);
    expect(result.part1.percentage).toBeGreaterThanOrEqual(70);
    expect(result.economicArchetype.name).toBe("아브라함형");
    expect(result.economicArchetype.subtitle).toBe("믿음의 모험가");
  });

  it.each([
    [[1, 1, 5], 7, "양호"],
    [[1, 2, 5], 8, "주의"],
    [[3, 3, 4], 10, "주의"],
    [[3, 3, 5], 11, "고위험"],
  ] as const)(
    "classifies Part 2 raw score %s as %s",
    (answersForEsau, rawScore, level) => {
      const answers = answersWith(1);
      setValues(answers, 41, [...answersForEsau]);

      const result = scoreSurveyAnswers(answers);

      expect(result.part2.risks.esau.rawScore).toBe(rawScore);
      expect(result.part2.risks.esau.percentage).toBeCloseTo(
        (rawScore / 15) * 100,
      );
      expect(result.part2.risks.esau.level).toBe(level);
    },
  );

  it("computes Part 2 risk levels for all eight syndromes", () => {
    const answers = answersWith(1);

    setValues(answers, 41, [1, 1, 5]);
    setValues(answers, 44, [1, 2, 5]);
    setValues(answers, 47, [3, 3, 4]);
    setValues(answers, 50, [3, 3, 5]);
    setValues(answers, 53, [5, 5, 5]);
    setValues(answers, 56, [2, 2, 2]);
    setValues(answers, 59, [4, 4, 4]);
    setValues(answers, 62, [1, 3, 3]);

    const result = scoreSurveyAnswers(answers);

    expect(result.part2.risks).toMatchObject({
      esau: { rawScore: 7, maxScore: 15, level: "양호" },
      ahab: { rawScore: 8, maxScore: 15, level: "주의" },
      ananias: { rawScore: 10, maxScore: 15, level: "주의" },
      achan: { rawScore: 11, maxScore: 15, level: "고위험" },
      richFool: { rawScore: 15, maxScore: 15, level: "고위험" },
      solomon: { rawScore: 6, maxScore: 15, level: "양호" },
      oneTalentServant: { rawScore: 12, maxScore: 15, level: "고위험" },
      martha: { rawScore: 7, maxScore: 15, level: "양호" },
    });
  });

  it("computes Part 3 MSIG profile percentages and identifies the lowest area", () => {
    const answers = answersWith(1);

    setRange(answers, 65, 68, 5);
    setRange(answers, 69, 72, 2);
    setRange(answers, 73, 76, 4);
    setRange(answers, 77, 80, 3);

    const result = scoreSurveyAnswers(answers);

    expect(result.part3.profile).toMatchObject({
      making: { rawScore: 20, maxScore: 20, percentage: 100 },
      spending: { rawScore: 8, maxScore: 20, percentage: 40 },
      investing: { rawScore: 16, maxScore: 20, percentage: 80 },
      giving: { rawScore: 12, maxScore: 20, percentage: 60 },
    });
    expect(result.part3.lowestArea).toMatchObject({
      key: "spending",
      name: "Spending",
      rawScore: 8,
      percentage: 40,
    });
  });
});
