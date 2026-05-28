import { scoreSurveyAnswers, type Part1CompetencyKey, type Part2RiskKey, type Part3ProfileKey, type SurveyAnswers } from "@/lib/scoring";
import { readJsonWithTtl, RESULT_STORAGE_KEYS, type UserProfile } from "@/lib/storage";
import { SURVEY_PARTS, SURVEY_QUESTIONS } from "@/lib/survey-data";

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatPercent = (value: number) => `${Math.round(value)}%`;

export const COMPETENCY_LABELS: Record<Part1CompetencyKey, string> = {
  abraham: "아브라함의 믿음",
  david: "다윗의 열정",
  joseph: "요셉의 지혜",
  nehemiah: "느헤미야의 전략",
  samson: "삼손의 위험 감지",
  daniel: "다니엘의 일관성",
};

export const RISK_LABELS: Record<Part2RiskKey, { name: string; subtitle: string }> = {
  esau: { name: "에서 증후군", subtitle: "충동 소비" },
  ahab: { name: "아합 증후군", subtitle: "경제적 의존" },
  ananias: { name: "아나니아 증후군", subtitle: "과시적 나눔" },
  achan: { name: "아간 증후군", subtitle: "탐욕 · 도박" },
  richFool: { name: "어리석은 부자 증후군", subtitle: "저장 집착" },
  solomon: { name: "솔로몬 증후군", subtitle: "과소비 · 사치" },
  oneTalentServant: { name: "한 달란트 증후군", subtitle: "가난의 맹세" },
  martha: { name: "마르다 증후군", subtitle: "일중독" },
};

export const PROFILE_LABELS: Record<Part3ProfileKey, { name: string; english: string }> = {
  mission: { name: "나의 부르심", english: "Mission" },
  stewardship: { name: "청지기 사명", english: "Stewardship" },
  building: { name: "세움과 성장", english: "Building" },
  flowing: { name: "나눔과 기부", english: "Flowing" },
};

export const ARCHETYPE_DETAILS: Record<string, { description: string; strength: string; weakness: string; prescription: string }> = {
  아브라함형: { description: "높은 믿음과 도전 정신을 바탕으로 경제적 위험도 감수하며, 하나님의 인도하심을 믿고 과감하게 결정을 내리고 나아가는 유형입니다.", strength: "강한 믿음, 도전 정신, 낙관성", weakness: "무모한 투자 위험, 현실 감각 부족", prescription: "요셉의 지혜와 느헤미야의 전략을 보강해 믿음과 계획을 함께 세우세요." },
  나발형: { description: "관리와 축적 능력은 있으나 나눔과 관계의 기쁨이 약해질 수 있는 유형입니다.", strength: "저축 능력, 절약 정신", weakness: "인색함, 관계 단절, 나눔의 기쁨 상실", prescription: "작은 것부터 나누는 연습을 시작하세요." },
  야곱형: { description: "현실 감각과 실행력이 좋고 목표 달성을 위한 방법을 빠르게 찾는 유형입니다.", strength: "전략적 사고, 실행력, 적응력", weakness: "편법 유혹, 윤리적 경계 모호", prescription: "다니엘의 일관성을 본받아 정직한 방식으로 경제활동을 정렬하세요." },
  발람형: { description: "기회 포착력은 있으나 돈이 신앙의 중심을 밀어낼 수 있어 주의가 필요합니다.", strength: "경제적 감각, 기회 포착력", weakness: "맘몬 숭배 위험, 영적 타협", prescription: "아브라함의 믿음으로 돌아가 재정의 주인을 다시 확인하세요." },
  엘리야형: { description: "경험과 분별은 있으나 현재 에너지와 회복 탄력성이 낮아질 수 있는 유형입니다.", strength: "과거 경험과 지혜", weakness: "무기력, 포기 심리", prescription: "다윗의 열정을 회복하세요. 안식과 재충전의 시간이 필요합니다." },
  아간형: { description: "대담하게 움직이지만 위험한 투자나 욕심에 노출될 가능성이 높은 유형입니다.", strength: "추진력, 대담함", weakness: "도박성 투자, 탐욕, 법적 위험", prescription: "느헤미야의 전략과 삼손의 위험 경계 훈련을 우선순위에 두세요." },
  탕자형: { description: "관대하고 사교적이지만 수입 대비 지출 통제가 약해 미래 불안으로 이어질 수 있습니다.", strength: "관대함, 사교성", weakness: "무절제, 저축 부족, 미래 불안", prescription: "요셉의 지혜로 수입 대비 지출 관리를 시작하세요." },
  므비보셋형: { description: "겸손하고 순종적인 태도는 있으나 경제적 자립과 선택 훈련이 더 필요한 유형입니다.", strength: "겸손함, 순종적 태도", weakness: "의존성, 자립 능력 부족, 소극성", prescription: "다윗의 열정으로 작은 목표부터 스스로 달성해보세요." },
};

const formatUserInfoHeader = (userProfile: UserProfile) => `
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:24px;font-family:Arial,'Malgun Gothic',sans-serif">
    <thead>
      <tr><th colspan="2" style="background:#f7e8ea;color:#312225;font-size:16px;font-weight:700;padding:12px 16px;text-align:left">응시자 정보</th></tr>
    </thead>
    <tbody>
      <tr><td style="padding:8px 16px;font-size:13px;color:#8a5b63;width:100px">이름</td><td style="padding:8px 16px;font-size:14px;font-weight:700;color:#312225">${escapeHtml(userProfile.name)}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#8a5b63">연락처</td><td style="padding:8px 16px;font-size:14px;color:#312225">${escapeHtml(userProfile.phone)}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#8a5b63">나이</td><td style="padding:8px 16px;font-size:14px;color:#312225">${escapeHtml(userProfile.age)}세</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#8a5b63">성별</td><td style="padding:8px 16px;font-size:14px;color:#312225">${escapeHtml(userProfile.gender)}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#8a5b63">출석교회</td><td style="padding:8px 16px;font-size:14px;color:#312225">${escapeHtml(userProfile.church)}</td></tr>
    </tbody>
  </table>
`;

export const formatSurveyResultForEmail = (answers: SurveyAnswers) => {
  const result = scoreSurveyAnswers(answers);
  const overall = Math.round(result.part1.percentage);
  const archetype = {
    ...result.economicArchetype,
    ...(ARCHETYPE_DETAILS[result.economicArchetype.name] ?? ARCHETYPE_DETAILS.엘리야형),
  };
  const capacityRows = (Object.entries(result.part1.competencies) as Array<[Part1CompetencyKey, (typeof result.part1.competencies)[Part1CompetencyKey]]>)
    .map(([key, score]) => `<tr><td>${escapeHtml(COMPETENCY_LABELS[key])}</td><td align="right"><strong>${score.rawScore}/${score.maxScore}</strong></td><td align="right">${formatPercent(score.percentage)}</td></tr>`)
    .join("");
  const riskRows = (Object.entries(result.part2.risks) as Array<[Part2RiskKey, (typeof result.part2.risks)[Part2RiskKey]]>)
    .map(([key, score]) => `<tr><td>${escapeHtml(RISK_LABELS[key].name)}</td><td>${escapeHtml(RISK_LABELS[key].subtitle)}</td><td align="center"><strong>${escapeHtml(score.level)}</strong></td><td align="right">${score.rawScore}/${score.maxScore}</td></tr>`)
    .join("");
  const profileRows = (Object.entries(result.part3.profile) as Array<[Part3ProfileKey, (typeof result.part3.profile)[Part3ProfileKey]]>)
    .map(([key, score]) => `<tr><td>${escapeHtml(PROFILE_LABELS[key].name)}</td><td>${escapeHtml(PROFILE_LABELS[key].english)}</td><td align="right"><strong>${score.rawScore}/${score.maxScore}</strong></td><td align="right">${formatPercent(score.percentage)}</td></tr>`)
    .join("");

  return `
    <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#312225">
      <h2 style="margin:0 0 12px;font-size:22px;color:#312225">종합 진단 결과</h2>
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:18px">
        <tbody>
          <tr>
            <td style="background:#fff4f4;border:1px solid #f1d7d7;padding:18px">
              <div style="font-size:13px;color:#8a5b63;margin-bottom:8px">GOSPEL ECONOMIC SPIRITUALITY</div>
              <div style="font-size:34px;font-weight:800;color:#d47182;line-height:1">${escapeHtml(result.part1.grade.code)}</div>
              <div style="font-size:15px;color:#615557;margin-top:8px">${overall} / 100점 · ${escapeHtml(result.part1.grade.label)}</div>
            </td>
            <td style="background:#fffdfd;border:1px solid #f1d7d7;padding:18px">
              <div style="font-size:13px;color:#8a5b63;margin-bottom:8px">나의 경제유형</div>
              <div style="font-size:24px;font-weight:800;color:#432424">${escapeHtml(archetype.name)}</div>
              <div style="font-size:15px;color:#615557;margin-top:6px">${escapeHtml(archetype.subtitle)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style="border:1px solid #f1d7d7;background:#fffafa;padding:16px;margin-bottom:18px">
        <p style="margin:0 0 12px;line-height:1.65">${escapeHtml(archetype.description)}</p>
        <p style="margin:0 0 8px"><strong>강점</strong>: ${escapeHtml(archetype.strength)}</p>
        <p style="margin:0 0 8px"><strong>약점</strong>: ${escapeHtml(archetype.weakness)}</p>
        <p style="margin:0"><strong>처방</strong>: ${escapeHtml(archetype.prescription)}</p>
      </div>

      <h3 style="margin:20px 0 8px;font-size:17px;color:#432424">6대 성경인물 역량 분석</h3>
      <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:13px;line-height:1.45;margin-bottom:18px"><tbody>${capacityRows}</tbody></table>

      <h3 style="margin:20px 0 8px;font-size:17px;color:#432424">8대 경제장애 위험도</h3>
      <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:13px;line-height:1.45;margin-bottom:18px"><tbody>${riskRows}</tbody></table>

      <h3 style="margin:20px 0 8px;font-size:17px;color:#432424">MSBF 행동 프로파일</h3>
      <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:13px;line-height:1.45;margin-bottom:24px"><tbody>${profileRows}</tbody></table>
    </div>
  `;
};

const formatAnswersTable = (answers: SurveyAnswers) => {
  const scoreColumns = [1, 2, 3, 4, 5];
  const rows = SURVEY_PARTS.flatMap((part) => {
    const partQuestions = SURVEY_QUESTIONS.filter((question) => question.part === part.id);
    const partHeader = `<tr><td colspan="7" style="background:#f7e8ea;color:#312225;font-weight:700;padding:10px 8px">${escapeHtml(part.title)} (${part.questionRange[0]}-${part.questionRange[1]}번, ${part.questionCount}문항)</td></tr>`;
    const questionRows = partQuestions.map((question) => {
      const answer = answers[question.id];
      return `<tr><td align="center" width="38">${question.id}</td><td>${escapeHtml(question.label)}</td>${scoreColumns.map((score) => `<td align="center" width="38"${answer === score ? ' style="color:#d92d20;font-weight:700;font-size:15px"' : ""}>${answer === score ? "✓" : score}</td>`).join("")}</tr>`;
    });
    return [partHeader, ...questionRows];
  }).join("");

  return `<h2 style="font-family:Arial,'Malgun Gothic',sans-serif;margin:24px 0 12px;font-size:20px;color:#312225">진단 문항 응답</h2><table border="1" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,'Malgun Gothic',sans-serif;font-size:13px;line-height:1.45"><tbody>${rows}</tbody></table>`;
};

export const formatEmailBody = (answers: SurveyAnswers, userProfile?: UserProfile) => {
  const userHeader = userProfile ? formatUserInfoHeader(userProfile) : "";
  return `${userHeader}${formatSurveyResultForEmail(answers)}${formatAnswersTable(answers)}`;
};

export const formatEmailBodyFromStorage = (userProfile?: UserProfile) => {
  const answers = readJsonWithTtl<SurveyAnswers>(RESULT_STORAGE_KEYS.answers, {}, RESULT_STORAGE_KEYS.legacyAnswers);
  return formatEmailBody(answers, userProfile);
};
