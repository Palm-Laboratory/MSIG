export type PartId = "part-1" | "part-2" | "part-3";

export type GroupId =
  | "abraham-faith"
  | "david-passion"
  | "joseph-wisdom"
  | "nehemiah-strategy"
  | "samson-risk"
  | "daniel-consistency"
  | "esau-syndrome"
  | "ahab-syndrome"
  | "ananias-syndrome"
  | "achan-syndrome"
  | "foolish-rich-syndrome"
  | "solomon-syndrome"
  | "one-talent-servant-syndrome"
  | "martha-syndrome"
  | "making"
  | "spending"
  | "investing"
  | "giving";

export type SurveyPart = {
  id: PartId;
  routeKey: PartId;
  title: string;
  subtitle: string;
  questionCount: number;
  questionRange: readonly [number, number];
};

export type SurveyGroup = {
  id: GroupId;
  part: PartId;
  name: string;
  subtitle: string;
  questionCount: number;
  questionRange: readonly [number, number];
};

export type SurveyQuestion = {
  id: number;
  part: PartId;
  groupId: GroupId;
  groupName: string;
  groupSubtitle: string;
  label: string;
  scripture: string;
  reverseScored: boolean;
};

export const LIKERT_LABELS = {
  1: "전혀 아니다",
  2: "아니다",
  3: "보통이다",
  4: "그렇다",
  5: "매우 그렇다",
} as const;

export const SURVEY_PARTS: readonly SurveyPart[] = [
  {
    id: "part-1",
    routeKey: "part-1",
    title: "Part 1. 6대 성경인물 역량 진단",
    subtitle: "6대 성경인물 역량 진단",
    questionCount: 40,
    questionRange: [1, 40],
  },
  {
    id: "part-2",
    routeKey: "part-2",
    title: "Part 2. 8대 경제장애 위험도",
    subtitle: "8대 경제장애 위험도",
    questionCount: 24,
    questionRange: [41, 64],
  },
  {
    id: "part-3",
    routeKey: "part-3",
    title: "Part 3. MSIG 행동 프로파일",
    subtitle: "MSIG 행동 프로파일",
    questionCount: 16,
    questionRange: [65, 80],
  },
];

export const SURVEY_GROUPS: readonly SurveyGroup[] = [
  {
    id: "abraham-faith",
    part: "part-1",
    name: "아브라함의 믿음",
    subtitle: "경제 마인드셋",
    questionCount: 7,
    questionRange: [1, 7],
  },
  {
    id: "david-passion",
    part: "part-1",
    name: "다윗의 열정",
    subtitle: "삶의 활력",
    questionCount: 6,
    questionRange: [8, 13],
  },
  {
    id: "joseph-wisdom",
    part: "part-1",
    name: "요셉의 지혜",
    subtitle: "경제적 능력",
    questionCount: 7,
    questionRange: [14, 20],
  },
  {
    id: "nehemiah-strategy",
    part: "part-1",
    name: "느헤미야의 전략",
    subtitle: "계획성·치밀성",
    questionCount: 6,
    questionRange: [21, 26],
  },
  {
    id: "samson-risk",
    part: "part-1",
    name: "삼손의 위험 감지",
    subtitle: "위험 노출도",
    questionCount: 7,
    questionRange: [27, 33],
  },
  {
    id: "daniel-consistency",
    part: "part-1",
    name: "다니엘의 일관성",
    subtitle: "사행일치",
    questionCount: 7,
    questionRange: [34, 40],
  },
  {
    id: "esau-syndrome",
    part: "part-2",
    name: "에서 증후군",
    subtitle: "충동 소비",
    questionCount: 3,
    questionRange: [41, 43],
  },
  {
    id: "ahab-syndrome",
    part: "part-2",
    name: "아합 증후군",
    subtitle: "경제적 의존",
    questionCount: 3,
    questionRange: [44, 46],
  },
  {
    id: "ananias-syndrome",
    part: "part-2",
    name: "아나니아 증후군",
    subtitle: "과시적 나눔",
    questionCount: 3,
    questionRange: [47, 49],
  },
  {
    id: "achan-syndrome",
    part: "part-2",
    name: "아간 증후군",
    subtitle: "탐욕·도박",
    questionCount: 3,
    questionRange: [50, 52],
  },
  {
    id: "foolish-rich-syndrome",
    part: "part-2",
    name: "어리석은 부자 증후군",
    subtitle: "저장 집착",
    questionCount: 3,
    questionRange: [53, 55],
  },
  {
    id: "solomon-syndrome",
    part: "part-2",
    name: "솔로몬 증후군",
    subtitle: "과소비·사치",
    questionCount: 3,
    questionRange: [56, 58],
  },
  {
    id: "one-talent-servant-syndrome",
    part: "part-2",
    name: "한 달란트 종 증후군",
    subtitle: "가난의 맹세",
    questionCount: 3,
    questionRange: [59, 61],
  },
  {
    id: "martha-syndrome",
    part: "part-2",
    name: "마르다 증후군",
    subtitle: "일중독",
    questionCount: 3,
    questionRange: [62, 64],
  },
  {
    id: "making",
    part: "part-3",
    name: "Making",
    subtitle: "돈 버는 행동",
    questionCount: 4,
    questionRange: [65, 68],
  },
  {
    id: "spending",
    part: "part-3",
    name: "Spending",
    subtitle: "돈 쓰는 행동",
    questionCount: 4,
    questionRange: [69, 72],
  },
  {
    id: "investing",
    part: "part-3",
    name: "Investing",
    subtitle: "돈 불리는 행동",
    questionCount: 4,
    questionRange: [73, 76],
  },
  {
    id: "giving",
    part: "part-3",
    name: "Giving",
    subtitle: "돈 나누는 행동",
    questionCount: 4,
    questionRange: [77, 80],
  },
];

const groupById = new Map(SURVEY_GROUPS.map((group) => [group.id, group]));

const question = (
  id: number,
  groupId: GroupId,
  label: string,
  scripture: string,
): SurveyQuestion => {
  const group = groupById.get(groupId);

  if (!group) {
    throw new Error(`Unknown survey group: ${groupId}`);
  }

  return {
    id,
    part: group.part,
    groupId,
    groupName: group.name,
    groupSubtitle: group.subtitle,
    label,
    scripture,
    reverseScored: id >= 27 && id <= 33,
  };
};

export const SURVEY_QUESTIONS: readonly SurveyQuestion[] = [
  question(1, "abraham-faith", "나는 하나님이 나의 모든 재정의 주인이심을 진심으로 믿는다.", "학 2:8"),
  question(2, "abraham-faith", "돈은 도구이지 인생의 목적이 아니라고 확신한다.", "딤전 6:10"),
  question(3, "abraham-faith", "경제적 어려움 속에서도 하나님의 선하심을 끝까지 신뢰한다.", "롬 8:28"),
  question(4, "abraham-faith", "부를 쌓는 것보다 나누는 것이 더 큰 축복이라고 믿는다.", "행 20:35"),
  question(5, "abraham-faith", "나의 경제적 성공은 하나님의 은혜에서 온다고 고백한다.", "신 8:18"),
  question(6, "abraham-faith", "맘몬(돈의 우상)의 유혹을 경계하며 살아가고 있다.", "마 6:24"),
  question(7, "abraham-faith", "경제적 결정 앞에서 기도로 먼저 하나님께 구한다.", "잠 3:5-6"),
  question(8, "david-passion", "매일 활기차게 하나님이 주신 일에 임하고 있다.", "골 3:23"),
  question(9, "david-passion", "경제적 목표를 향해 꾸준히 노력하는 것이 기쁘다.", "전 3:13"),
  question(10, "david-passion", "새로운 경제적 기회를 발견하면 적극적으로 도전한다.", "잠 31:16"),
  question(11, "david-passion", "경제적 실패를 겪어도 빠르게 회복하고 다시 일어선다.", "잠 24:16"),
  question(12, "david-passion", "나의 일과 경제활동에서 하나님 나라의 사명감을 느낀다.", "엡 2:10"),
  question(13, "david-passion", "건강한 생활습관으로 경제활동의 기반을 다지고 있다.", "고전 6:19"),
  question(14, "joseph-wisdom", "현재 수입과 지출을 정확하게 파악하고 관리하고 있다.", "잠 27:23"),
  question(15, "joseph-wisdom", "비상금(3~6개월 생활비)을 마련해 두고 있다.", "잠 21:20"),
  question(16, "joseph-wisdom", "부채를 체계적으로 관리하고 줄여가고 있다.", "롬 13:8"),
  question(17, "joseph-wisdom", "저축과 투자를 꾸준히 실천하고 있다.", "잠 13:11"),
  question(18, "joseph-wisdom", "십일조와 헌금을 성실하게 드리고 있다.", "말 3:10"),
  question(19, "joseph-wisdom", "경제 관련 지식을 꾸준히 학습하고 있다.", "잠 18:15"),
  question(20, "joseph-wisdom", "다양한 수입원을 개발하려고 노력하고 있다.", "전 11:2"),
  question(21, "nehemiah-strategy", "1년, 5년, 10년 단위의 재정 목표를 구체적으로 세우고 있다.", "잠 21:5"),
  question(22, "nehemiah-strategy", "매월 예산을 수립하고 그에 따라 지출을 관리한다.", "눅 14:28"),
  question(23, "nehemiah-strategy", "은퇴 후의 삶을 위해 구체적으로 준비하고 있다.", "잠 6:6-8"),
  question(24, "nehemiah-strategy", "다음 세대의 경제교육을 체계적으로 실시하고 있다.", "신 6:6-7"),
  question(25, "nehemiah-strategy", "보험, 연금 등 안전장치를 체계적으로 갖추고 있다.", "잠 22:3"),
  question(26, "nehemiah-strategy", "경제적 목표 달성을 위한 세부 실행 계획이 있다.", "잠 16:9"),
  question(27, "samson-risk", "충동적으로 큰 돈을 쓰는 경우가 종종 있다.", "잠 21:17"),
  question(28, "samson-risk", "빚을 갚지 못해 스트레스를 받고 있다.", "잠 22:7"),
  question(29, "samson-risk", "재정 상태를 가족에게 숨기는 경우가 있다.", "잠 28:13"),
  question(30, "samson-risk", "투자에서 큰 손실을 경험한 적이 있다.", "전 5:14"),
  question(31, "samson-risk", "남에게 보이기 위한 소비를 하는 편이다.", "요일 2:16"),
  question(32, "samson-risk", "경제적 결정을 감정에 따라 내리는 편이다.", "잠 14:29"),
  question(33, "samson-risk", "돈 문제로 가정에 갈등이 있다.", "잠 17:1"),
  question(34, "daniel-consistency", "예배 시간에 드리는 헌금의 마음이 일상의 소비와 일치한다.", "약 2:14"),
  question(35, "daniel-consistency", "정직하게 세금을 신고하고 납부한다.", "롬 13:7"),
  question(36, "daniel-consistency", "경제적 약속(빚 상환, 기한 준수 등)을 반드시 지킨다.", "시 15:4"),
  question(37, "daniel-consistency", "남몰래 나누는 삶을 실천하고 있다.", "마 6:3-4"),
  question(38, "daniel-consistency", "직장/사업에서 기독교인으로서의 윤리를 지킨다.", "골 3:23"),
  question(39, "daniel-consistency", "경제적 결정에서 성경적 원칙을 적용한다.", "시 119:105"),
  question(40, "daniel-consistency", "물질적 축복을 받을 때 교만하지 않고 감사한다.", "신 8:17-18"),
  question(41, "esau-syndrome", "세일이나 할인 행사에 약하여 계획에 없던 물건을 자주 산다.", "잠 21:17"),
  question(42, "esau-syndrome", "스트레스를 받으면 쇼핑으로 풀려는 경향이 있다.", "전 6:7"),
  question(43, "esau-syndrome", "나중에 후회할 소비를 반복하는 편이다.", "잠 21:20"),
  question(44, "ahab-syndrome", "경제적 결정을 주로 배우자나 부모에게 맡기는 편이다.", "잠 31:10"),
  question(45, "ahab-syndrome", "돈 관리에 대한 자신감이 부족하다.", "딤후 1:7"),
  question(46, "ahab-syndrome", "경제적 문제가 생기면 누군가가 해결해주기를 바란다.", "갈 6:5"),
  question(47, "ananias-syndrome", "다른 사람들에게 관대한 이미지를 보여주고 싶은 마음이 크다.", "마 6:2"),
  question(48, "ananias-syndrome", "형편에 맞지 않는 선물이나 대접을 하는 편이다.", "잠 12:9"),
  question(49, "ananias-syndrome", "SNS에 소비 생활을 과시하는 경향이 있다.", "요일 2:16"),
  question(50, "achan-syndrome", "일확천금의 기회에 솔깃한 편이다.", "잠 28:20"),
  question(51, "achan-syndrome", "도박성 투자나 게임에 빠져 본 적이 있다.", "딤전 6:9"),
  question(52, "achan-syndrome", "남의 것이 탐이 나거나 부러운 마음이 자주 든다.", "출 20:17"),
  question(53, "foolish-rich-syndrome", "돈을 쓰는 것 자체가 아깝고 불안하다.", "전 5:13"),
  question(54, "foolish-rich-syndrome", "필요한 것도 안 사고 극단적으로 아끼는 편이다.", "전 6:2"),
  question(55, "foolish-rich-syndrome", "충분한 자산이 있어도 경제적 불안감에 시달린다.", "눅 12:15"),
  question(56, "solomon-syndrome", "브랜드나 명품에 대한 욕구가 강한 편이다.", "잠 11:28"),
  question(57, "solomon-syndrome", "수입 대비 과도한 소비를 하고 있다.", "잠 21:17"),
  question(58, "solomon-syndrome", "외식, 여행, 취미 등에 과하게 지출하는 편이다.", "눅 15:13"),
  question(59, "one-talent-servant-syndrome", "돈을 버는 것 자체에 죄책감을 느끼는 편이다.", "전 5:19"),
  question(60, "one-talent-servant-syndrome", "'가난해야 영적이다'라는 생각이 있다.", "요삼 1:2"),
  question(61, "one-talent-servant-syndrome", "경제적 목표를 세우는 것을 세속적이라 여기는 편이다.", "잠 21:5"),
  question(62, "martha-syndrome", "일 때문에 가족과의 시간이 부족하다.", "전 4:6"),
  question(63, "martha-syndrome", "일을 쉬면 불안하고 죄책감이 든다.", "출 20:8-10"),
  question(64, "martha-syndrome", "돈을 더 벌기 위해 건강을 돌보지 않는 편이다.", "고전 6:19"),
  question(65, "making", "현재 직업/사업에서 수입을 늘리기 위해 적극적으로 노력하고 있다.", "잠 13:4"),
  question(66, "making", "새로운 수입원이나 부업을 개발하려는 노력을 하고 있다.", "전 11:6"),
  question(67, "making", "자기계발을 통해 경제적 가치를 높이고 있다.", "잠 22:29"),
  question(68, "making", "하나님이 주신 달란트를 활용하여 경제활동을 하고 있다.", "마 25:20"),
  question(69, "spending", "꼭 필요한 것과 원하는 것을 구분하여 소비한다.", "빌 4:12"),
  question(70, "spending", "가계부 등을 통해 지출을 체계적으로 관리한다.", "잠 27:23"),
  question(71, "spending", "할인이나 프로모션에 흔들리지 않고 계획대로 소비한다.", "잠 21:5"),
  question(72, "spending", "가족과 소비 기준에 대해 합의하고 실천하고 있다.", "암 3:3"),
  question(73, "investing", "매월 정기적으로 저축하는 습관이 있다.", "잠 21:20"),
  question(74, "investing", "투자에 대해 공부하고 신중하게 결정한다.", "잠 18:15"),
  question(75, "investing", "분산투자 등 위험관리를 실천하고 있다.", "전 11:2"),
  question(76, "investing", "은퇴 후를 위한 장기 투자 계획이 있다.", "잠 6:6-8"),
  question(77, "giving", "십일조를 기쁜 마음으로 성실히 드리고 있다.", "말 3:10"),
  question(78, "giving", "감사헌금, 선교헌금 등을 자발적으로 드리고 있다.", "고후 9:7"),
  question(79, "giving", "이웃의 필요를 보면 물질적으로 돕고 있다.", "약 2:15-16"),
  question(80, "giving", "나눔을 통해 기쁨과 감사를 경험하고 있다.", "행 20:35"),
];

export const questions = SURVEY_QUESTIONS;
export const surveyParts = SURVEY_PARTS;
export const surveyGroups = SURVEY_GROUPS;
export const likertLabels = LIKERT_LABELS;
