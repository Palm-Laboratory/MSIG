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
  question(1, "abraham-faith", "나는 하나님이 나의 모든 재정의 주인이심을 진심으로 믿는다.", "은도 내 것이요 금도 내 것이니라 만군의 여호와의 말이니라 (학 2:8)"),
  question(2, "abraham-faith", "돈은 도구이지 인생의 목적이 아니라고 확신한다.", "돈을 사랑함이 일만 악의 뿌리가 되나니 이것을 탐내는 자들은 미혹을 받아 믿음에서 떠나 많은 근심으로써 자기를 찔렀도다 (딤전 6:10)"),
  question(3, "abraham-faith", "경제적 어려움 속에서도 하나님의 선하심을 끝까지 신뢰한다.", "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 3)모든 것이 합력하여 선을 이루느니라 (롬 8:28)"),
  question(4, "abraham-faith", "부를 쌓는 것보다 나누는 것이 더 큰 축복이라고 믿는다.", "범사에 여러분에게 모본을 보여준 바와 같이 수고하여 약한 사람들을 돕고 또 주 예수께서 친히 말씀하신 바 주는 것이 받는 것보다 복이 있다 하심을 기억하여야 할지니라 (행 20:35)"),
  question(5, "abraham-faith", "나의 경제적 성공은 하나님의 은혜에서 온다고 고백한다.", "네 하나님 여호와를 기억하라 그가 네게 재물 얻을 능력을 주셨음이라 이같이 하심은 네 조상들에게 맹세하신 언약을 오늘과 같이 이루려 하심이니라 (신 8:18)"),
  question(6, "abraham-faith", "맘몬(돈의 우상)의 유혹을 경계하며 살아가고 있다.", "한 사람이 두 주인을 섬기지 못할 것이니 혹 이를 미워하고 저를 사랑하거나 혹 이를 중히 여기고 저를 경히 여김이라 너희가 하나님과 재물을 겸하여 섬기지 못하느니라 (마 6:24)"),
  question(7, "abraham-faith", "경제적 결정 앞에서 기도로 먼저 하나님께 구한다.", "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라, 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라 (잠 3:5-6)"),
  question(8, "david-passion", "매일 활기차게 하나님이 주신 일에 임하고 있다.", "무슨 일을 하든지 마음을 다하여 주께 하듯 하고 사람에게 하듯 하지 말라 (골 3:23)"),
  question(9, "david-passion", "경제적 목표를 향해 꾸준히 노력하는 것이 기쁘다.", "사람마다 먹고 마시는 것과 수고함으로 낙을 누리는 그것이 하나님의 선물인 줄도 또한 알았도다 (전 3:13)"),
  question(10, "david-passion", "새로운 경제적 기회를 발견하면 적극적으로 도전한다.", "밭을 살펴 보고 사며 자기의 손으로 번 것을 가지고 포도원을 일구며 (잠 31:16)"),
  question(11, "david-passion", "경제적 실패를 겪어도 빠르게 회복하고 다시 일어선다.", "대저 의인은 일곱 번 넘어질지라도 다시 일어나려니와 악인은 재앙으로 말미암아 엎드러지느니라 (잠 24:16)"),
  question(12, "david-passion", "나의 일과 경제활동에서 하나님 나라의 사명감을 느낀다.", "우리는 그가 만드신 바라 그리스도 예수 안에서 선한 일을 위하여 지으심을 받은 자니 이 일은 하나님이 전에 예비하사 우리로 그 가운데서 행하게 하려 하심이니라 (엡 2:10)"),
  question(13, "david-passion", "건강한 생활습관으로 경제활동의 기반을 다지고 있다.", "너희 몸은 너희가 하나님께로부터 받은 바 너희 가운데 계신 성령의 전인 줄을 알지 못하느냐 너희는 너희 자신의 것이 아니라 (고전 6:19)"),
  question(14, "joseph-wisdom", "현재 수입과 지출을 정확하게 파악하고 관리하고 있다.", "네 양 떼의 형편을 부지런히 살피며 네 소 떼에게 마음을 두라 (잠 27:23)"),
  question(15, "joseph-wisdom", "비상금(3~6개월 생활비)을 마련해 두고 있다.", "지혜 있는 자의 집에는 귀한 보배와 기름이 있으나 미련한 자는 이것을 다 삼켜 버리느니라 (잠 21:20)"),
  question(16, "joseph-wisdom", "부채를 체계적으로 관리하고 줄여가고 있다.", "피차 사랑의 빚 외에는 아무에게든지 아무 빚도 지지 말라 남을 사랑하는 자는 율법을 다 이루었느니라 (롬 13:8)"),
  question(17, "joseph-wisdom", "저축과 투자를 꾸준히 실천하고 있다.", "망령되이 얻은 재물은 줄어가고 손으로 모은 것은 늘어가느니라 (잠 13:11)"),
  question(18, "joseph-wisdom", "십일조와 헌금을 성실하게 드리고 있다.", "만군의 여호와가 이르노라 너희의 온전한 십일조를 창고에 들여 나의 집에 양식이 있게 하고 그것으로 나를 시험하여 내가 하늘 문을 열고 너희에게 복을 쌓을 곳이 없도록 붓지 아니하나 보라 (말 3:10)"),
  question(19, "joseph-wisdom", "경제 관련 지식을 꾸준히 학습하고 있다.", "명철한 자의 마음은 지식을 얻고 지혜로운 자의 귀는 지식을 구하느니라 (잠 18:15)"),
  question(20, "joseph-wisdom", "다양한 수입원을 개발하려고 노력하고 있다.", "일곱에게나 여덟에게 나눠 줄지어다 무슨 재앙이 땅에 임할는지 네가 알지 못함이니라 (전 11:2)"),
  question(21, "nehemiah-strategy", "1년, 5년, 10년 단위의 재정 목표를 구체적으로 세우고 있다.", "부지런한 자의 경영은 풍부함에 이를 것이나 조급한 자는 궁핍함에 이를 따름이니라 (잠 21:5)"),
  question(22, "nehemiah-strategy", "매월 예산을 수립하고 그에 따라 지출을 관리한다.", "너희 중의 누가 망대를 세우고자 할진대 자기의 가진 것이 준공하기까지에 족할는지 먼저 앉아 그 비용을 계산하지 아니하겠느냐 (눅 14:28)"),
  question(23, "nehemiah-strategy", "은퇴 후의 삶을 위해 구체적으로 준비하고 있다.", "게으른 자여 개미에게 가서 그가 하는 것을 보고 지혜를 얻으라, 개미는 두령도 없고 감독자도 없고 통치자도 없으되, 먹을 것을 여름 동안에 예비하며 추수 때에 양식을 모으느니라 (잠 6:6-8)"),
  question(24, "nehemiah-strategy", "다음 세대의 경제교육을 체계적으로 실시하고 있다.", "오늘 내가 네게 명하는 이 말씀을 너는 마음에 새기고, 네 자녀에게 부지런히 가르치며 집에 앉았을 때에든지 길을 갈 때에든지 누워 있을 때에든지 일어날 때에든지 이 말씀을 강론할 것이며 (신 6:6-7)"),
  question(25, "nehemiah-strategy", "보험, 연금 등 안전장치를 체계적으로 갖추고 있다.", "슬기로운 자는 재앙을 보면 숨어 피하여도 어리석은 자는 나가다가 해를 받느니라 (잠 22:3)"),
  question(26, "nehemiah-strategy", "경제적 목표 달성을 위한 세부 실행 계획이 있다.", "사람이 마음으로 자기의 길을 계획할지라도 그의 걸음을 인도하시는 이는 여호와시니라 (잠 16:9)"),
  question(27, "samson-risk", "충동적으로 큰 돈을 쓰는 경우가 종종 있다.", "연락을 좋아하는 자는 가난하게 되고 술과 기름을 좋아하는 자는 부하게 되지 못하느니라 (잠 21:17)"),
  question(28, "samson-risk", "빚을 갚지 못해 스트레스를 받고 있다.", "부자는 가난한 자를 주관하고 빚진 자는 채주의 종이 되느니라 (잠 22:7)"),
  question(29, "samson-risk", "재정 상태를 가족에게 숨기는 경우가 있다.", "자기의 죄를 숨기는 자는 형통하지 못하나 죄를 자복하고 버리는 자는 불쌍히 여김을 받으리라 (잠 28:13)"),
  question(30, "samson-risk", "투자에서 큰 손실을 경험한 적이 있다.", "그 재물이 재난을 당할 때 없어지나니 비록 아들은 낳았으나 그 손에 아무것도 없느니라 (전 5:14)"),
  question(31, "samson-risk", "남에게 보이기 위한 소비를 하는 편이다.", "이는 세상에 있는 모든 것이 육신의 정욕과 안목의 정욕과 이생의 자랑이니 다 아버지께로부터 온 것이 아니요 세상으로부터 온 것이라 (요일 2:16)"),
  question(32, "samson-risk", "경제적 결정을 감정에 따라 내리는 편이다.", "노하기를 더디 하는 자는 크게 명철하여도 마음이 조급한 자는 어리석음을 나타내느니라 (잠 14:29)"),
  question(33, "samson-risk", "돈 문제로 가정에 갈등이 있다.", "마른 떡 한 조각만 있고도 화목하는 것이 제육이 집에 가득하고도 다투는 것보다 나으니라 (잠 17:1)"),
  question(34, "daniel-consistency", "예배 시간에 드리는 헌금의 마음이 일상의 소비와 일치한다.", "내 형제들아 만일 사람이 믿음이 있노라 하고 행함이 없으면 무슨 유익이 있으리요 그 믿음이 능히 자기를 구원하겠느냐 (약 2:14)"),
  question(35, "daniel-consistency", "정직하게 세금을 신고하고 납부한다.", "모든 자에게 줄 것을 주되 조세를 받을 자에게 조세를 바치고 관세를 받을 자에게 관세를 바치고 두려워할 자를 두려워하며 존경할 자를 존경하라 (롬 13:7)"),
  question(36, "daniel-consistency", "경제적 약속(빚 상환, 기한 준수 등)을 반드시 지킨다.", "그의 눈은 망령된 자를 멸시하며 여호와를 두려워하는 자들을 존대하며 그의 마음에 서원한 것은 해로울지라도 변하지 아니하며 (시 15:4)"),
  question(37, "daniel-consistency", "남몰래 나누는 삶을 실천하고 있다.", "너는 구제할 때에 오른손이 하는 것을 왼손이 모르게 하여, 네 구제함을 은밀하게 하라 은밀한 중에 보시는 너의 아버지께서 갚으시리라 (마 6:3-4)"),
  question(38, "daniel-consistency", "직장/사업에서 기독교인으로서의 윤리를 지킨다.", "무슨 일을 하든지 마음을 다하여 주께 하듯 하고 사람에게 하듯 하지 말라 (골 3:23)"),
  question(39, "daniel-consistency", "경제적 결정에서 성경적 원칙을 적용한다.", "주의 말씀은 내 발에 등이요 내 길에 빛이니이다 (시 119:105)"),
  question(40, "daniel-consistency", "물질적 축복을 받을 때 교만하지 않고 감사한다.", "그러나 네가 마음에 이르기를 내 능력과 내 손의 힘으로 내가 이 재물을 얻었다 말할 것이라, 네 하나님 여호와를 기억하라 그가 네게 재물 얻을 능력을 주셨음이라 이같이 하심은 네 조상들에게 맹세하신 언약을 오늘과 같이 이루려 하심이니라 (신 8:17-18)"),
  question(41, "esau-syndrome", "세일이나 할인 행사에 약하여 계획에 없던 물건을 자주 산다.", "연락을 좋아하는 자는 가난하게 되고 술과 기름을 좋아하는 자는 부하게 되지 못하느니라 (잠 21:17)"),
  question(42, "esau-syndrome", "스트레스를 받으면 쇼핑으로 풀려는 경향이 있다.", "사람의 수고는 다 자기의 입을 위함이나 그 식욕은 채울 수 없느니라 (전 6:7)"),
  question(43, "esau-syndrome", "나중에 후회할 소비를 반복하는 편이다.", "지혜 있는 자의 집에는 귀한 보배와 기름이 있으나 미련한 자는 이것을 다 삼켜 버리느니라 (잠 21:20)"),
  question(44, "ahab-syndrome", "경제적 결정을 주로 배우자나 부모에게 맡기는 편이다.", "누가 현숙한 여인을 찾아 얻겠느냐 그의 값은 진주보다 더 하니라 (잠 31:10)"),
  question(45, "ahab-syndrome", "돈 관리에 대한 자신감이 부족하다.", "하나님이 우리에게 주신 것은 두려워하는 1)마음이 아니요 오직 능력과 사랑과 절제하는 마음이니 (딤후 1:7)"),
  question(46, "ahab-syndrome", "경제적 문제가 생기면 누군가가 해결해주기를 바란다.", "각각 자기의 짐을 질 것이라 (갈 6:5)"),
  question(47, "ananias-syndrome", "다른 사람들에게 관대한 이미지를 보여주고 싶은 마음이 크다.", "그러므로 구제할 때에 외식하는 자가 사람에게서 영광을 받으려고 회당과 거리에서 하는 것 같이 너희 앞에 나팔을 불지 말라 진실로 너희에게 이르노니 그들은 자기 상을 이미 받았느니라 (마 6:2)"),
  question(48, "ananias-syndrome", "형편에 맞지 않는 선물이나 대접을 하는 편이다.", "비천히 여김을 받을지라도 종을 부리는 자는 스스로 높은 체하고도 음식이 핍절한 자보다 나으니라 (잠 12:9)"),
  question(49, "ananias-syndrome", "SNS에 소비 생활을 과시하는 경향이 있다.", "이는 세상에 있는 모든 것이 육신의 정욕과 안목의 정욕과 이생의 자랑이니 다 아버지께로부터 온 것이 아니요 세상으로부터 온 것이라 (요일 2:16)"),
  question(50, "achan-syndrome", "일확천금의 기회에 솔깃한 편이다.", "충성된 자는 복이 많아도 속히 부하고자 하는 자는 형벌을 면하지 못하리라 (잠 28:20)"),
  question(51, "achan-syndrome", "도박성 투자나 게임에 빠져 본 적이 있다.", "부하려 하는 자들은 시험과 올무와 여러 가지 어리석고 해로운 욕심에 떨어지나니 곧 사람으로 파멸과 멸망에 빠지게 하는 것이라 (딤전 6:9)"),
  question(52, "achan-syndrome", "남의 것이 탐이 나거나 부러운 마음이 자주 든다.", "네 이웃의 집을 탐내지 말라 네 이웃의 아내나 그의 남종이나 그의 여종이나 그의 소나 그의 나귀나 무릇 네 이웃의 소유를 탐내지 말라 (출 20:17)"),
  question(53, "foolish-rich-syndrome", "돈을 쓰는 것 자체가 아깝고 불안하다.", "내가 해 아래에서 큰 폐단 되는 일이 있는 것을 보았나니 곧 소유주가 재물을 자기에게 해가 되도록 소유하는 것이라 (전 5:13)"),
  question(54, "foolish-rich-syndrome", "필요한 것도 안 사고 극단적으로 아끼는 편이다.", "어떤 사람은 그의 영혼이 바라는 모든 소원에 부족함이 없어 재물과 부요와 존귀를 하나님께 받았으나 하나님께서 그가 그것을 누리도록 허락하지 아니하셨으므로 다른 사람이 누리나니 이것도 헛되어 악한 병이로다 (전 6:2)"),
  question(55, "foolish-rich-syndrome", "충분한 자산이 있어도 경제적 불안감에 시달린다.", "그들에게 이르시되 삼가 모든 탐심을 물리치라 사람의 생명이 그 소유의 넉넉한 데 있지 아니하니라 하시고 (눅 12:15)"),
  question(56, "solomon-syndrome", "브랜드나 명품에 대한 욕구가 강한 편이다.", "자기의 재물을 의지하는 자는 패망하려니와 의인은 푸른 잎사귀 같아서 번성하리라 (잠 11:28)"),
  question(57, "solomon-syndrome", "수입 대비 과도한 소비를 하고 있다.", "연락을 좋아하는 자는 가난하게 되고 술과 기름을 좋아하는 자는 부하게 되지 못하느니라 (잠 21:17)"),
  question(58, "solomon-syndrome", "외식, 여행, 취미 등에 과하게 지출하는 편이다.", "그 후 며칠이 안 되어 둘째 아들이 재물을 다 모아 가지고 먼 나라에 가 거기서 허랑방탕하여 그 재산을 낭비하더니 (눅 15:13)"),
  question(59, "one-talent-servant-syndrome", "돈을 버는 것 자체에 죄책감을 느끼는 편이다.", "또한 어떤 사람에게든지 하나님이 재물과 부요를 그에게 주사 능히 누리게 하시며 제 몫을 받아 수고함으로 즐거워하게 하신 것은 하나님의 선물이라 (전 5:19)"),
  question(60, "one-talent-servant-syndrome", "'가난해야 영적이다'라는 생각이 있다.", "사랑하는 자여 네 영혼이 잘됨 같이 네가 범사에 잘되고 강건하기를 내가 간구하노라 (요삼 1:2)"),
  question(61, "one-talent-servant-syndrome", "경제적 목표를 세우는 것을 세속적이라 여기는 편이다.", "부지런한 자의 경영은 풍부함에 이를 것이나 조급한 자는 궁핍함에 이를 따름이니라 (잠 21:5)"),
  question(62, "martha-syndrome", "일 때문에 가족과의 시간이 부족하다.", "두 손에 가득하고 수고하며 바람을 잡는 것보다 한 손에만 가득하고 평온함이 더 나으니라 (전 4:6)"),
  question(63, "martha-syndrome", "일을 쉬면 불안하고 죄책감이 든다.", "안식일을 기억하여 거룩하게 지키라, 엿새 동안은 힘써 네 모든 일을 행할 것이나, 일곱째 날은 네 하나님 여호와의 안식일인즉 너나 네 아들이나 네 딸이나 네 남종이나 네 여종이나 네 가축이나 네 문안에 머무는 객이라도 아무 일도 하지 말라 (출 20:8-10)"),
  question(64, "martha-syndrome", "돈을 더 벌기 위해 건강을 돌보지 않는 편이다.", "너희 몸은 너희가 하나님께로부터 받은 바 너희 가운데 계신 성령의 전인 줄을 알지 못하느냐 너희는 너희 자신의 것이 아니라 (고전 6:19)"),
  question(65, "making", "현재 직업/사업에서 수입을 늘리기 위해 적극적으로 노력하고 있다.", "게으른 자는 마음으로 원하여도 얻지 못하나 부지런한 자의 마음은 풍족함을 얻느니라 (잠 13:4)"),
  question(66, "making", "새로운 수입원이나 부업을 개발하려는 노력을 하고 있다.", "너는 아침에 씨를 뿌리고 저녁에도 손을 놓지 말라 이것이 잘 될는지, 저것이 잘 될는지, 혹 둘이 다 잘 될는지 알지 못함이니라 (전 11:6)"),
  question(67, "making", "자기계발을 통해 경제적 가치를 높이고 있다.", "네가 자기의 일에 능숙한 사람을 보았느냐 이러한 사람은 왕 앞에 설 것이요 천한 자 앞에 서지 아니하리라 (잠 22:29)"),
  question(68, "making", "하나님이 주신 달란트를 활용하여 경제활동을 하고 있다.", "다섯 달란트 받았던 자는 다섯 달란트를 더 가지고 와서 이르되 주인이여 내게 다섯 달란트를 주셨는데 보소서 내가 또 다섯 달란트를 남겼나이다 (마 25:20)"),
  question(69, "spending", "꼭 필요한 것과 원하는 것을 구분하여 소비한다.", "나는 비천에 처할 줄도 알고 풍부에 처할 줄도 알아 모든 일 곧 배부름과 배고픔과 풍부와 궁핍에도 처할 줄 아는 일체의 비결을 배웠노라 (빌 4:12)"),
  question(70, "spending", "가계부 등을 통해 지출을 체계적으로 관리한다.", "네 양 떼의 형편을 부지런히 살피며 네 소 떼에게 마음을 두라 (잠 27:23)"),
  question(71, "spending", "할인이나 프로모션에 흔들리지 않고 계획대로 소비한다.", "부지런한 자의 경영은 풍부함에 이를 것이나 조급한 자는 궁핍함에 이를 따름이니라 (잠 21:5)"),
  question(72, "spending", "가족과 소비 기준에 대해 합의하고 실천하고 있다.", "두 사람이 뜻이 같지 않은데 어찌 동행하겠으며 (암 3:3)"),
  question(73, "investing", "매월 정기적으로 저축하는 습관이 있다.", "지혜 있는 자의 집에는 귀한 보배와 기름이 있으나 미련한 자는 이것을 다 삼켜 버리느니라 (잠 21:20)"),
  question(74, "investing", "투자에 대해 공부하고 신중하게 결정한다.", "명철한 자의 마음은 지식을 얻고 지혜로운 자의 귀는 지식을 구하느니라 (잠 18:15)"),
  question(75, "investing", "분산투자 등 위험관리를 실천하고 있다.", "일곱에게나 여덟에게 나눠 줄지어다 무슨 재앙이 땅에 임할는지 네가 알지 못함이니라 (전 11:2)"),
  question(76, "investing", "은퇴 후를 위한 장기 투자 계획이 있다.", "게으른 자여 개미에게 가서 그가 하는 것을 보고 지혜를 얻으라, 개미는 두령도 없고 감독자도 없고 통치자도 없으되, 먹을 것을 여름 동안에 예비하며 추수 때에 양식을 모으느니라 (잠 6:6-8)"),
  question(77, "giving", "십일조를 기쁜 마음으로 성실히 드리고 있다.", "만군의 여호와가 이르노라 너희의 온전한 십일조를 창고에 들여 나의 집에 양식이 있게 하고 그것으로 나를 시험하여 내가 하늘 문을 열고 너희에게 복을 쌓을 곳이 없도록 붓지 아니하나 보라 (말 3:10)"),
  question(78, "giving", "감사헌금, 선교헌금 등을 자발적으로 드리고 있다.", "각각 그 마음에 정한 대로 할 것이요 인색함으로나 억지로 하지 말지니 하나님은 즐겨 내는 자를 사랑하시느니라 (고후 9:7)"),
  question(79, "giving", "이웃의 필요를 보면 물질적으로 돕고 있다.", "만일 형제나 자매가 헐벗고 일용할 양식이 없는데, 너희 중에 누구든지 그에게 이르되 평안히 가라, 덥게 하라, 배부르게 하라 하며 그 몸에 쓸 것을 주지 아니하면 무슨 유익이 있으리요 (약 2:15-16)"),
  question(80, "giving", "나눔을 통해 기쁨과 감사를 경험하고 있다.", "범사에 여러분에게 모본을 보여준 바와 같이 수고하여 약한 사람들을 돕고 또 주 예수께서 친히 말씀하신 바 주는 것이 받는 것보다 복이 있다 하심을 기억하여야 할지니라 (행 20:35)"),
];

export const questions = SURVEY_QUESTIONS;
export const surveyParts = SURVEY_PARTS;
export const surveyGroups = SURVEY_GROUPS;
export const likertLabels = LIKERT_LABELS;
