import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";

const heroImage = "https://www.figma.com/api/mcp/asset/e25fe8f4-de54-42bc-9c64-7185c6736aaf";
const badgeIcon = "https://www.figma.com/api/mcp/asset/1104be0c-3e0b-4969-a9dc-2db15bee3f47";
const arrowIcon = "https://www.figma.com/api/mcp/asset/1468db5d-6b4c-47ff-a666-ccc99c58ca86";
const section2Shape = "https://www.figma.com/api/mcp/asset/290af162-de15-45da-a0c5-7d76b72e4c35";
const serviceStepIcon1 = "https://www.figma.com/api/mcp/asset/206d573e-6970-4207-9f36-a1bb459311e3";
const serviceStepIcon2 = "https://www.figma.com/api/mcp/asset/3d967703-f5d2-46d9-9990-c78f313050ff";
const serviceStepIcon3 = "https://www.figma.com/api/mcp/asset/3c706c7f-d108-4066-bc92-ee9ed3faf091";
const serviceStepIcon4 = "https://www.figma.com/api/mcp/asset/8d8f4e04-6c11-493a-b652-5d0388ad22d8";

const hiddenQuestions = [
  {
    icon: "https://www.figma.com/api/mcp/asset/48c435ff-5ba3-4502-b5c5-6dc2a38d652c",
    title: "경제적 불안감",
    description: "하나님의 돌보심을 신뢰하지만 내일의 생계를 걱정하는 현실",
  },
  {
    icon: "https://www.figma.com/api/mcp/asset/4af6143d-b19a-4dc5-94f3-0c18e34cd376",
    title: "가족 간의 갈등",
    description: "소비, 부채, 투자 실패로 가정 내 경제 갈등이 반복",
  },
  {
    icon: "https://www.figma.com/api/mcp/asset/ae8d614d-55ed-4664-8dc9-06bc0bd2cded",
    title: "신앙과 경제의 괴리",
    description: "주일 예배의 고백과 월요일 경제 상황이 일치하지 않는 이중성",
  },
  {
    icon: "https://www.figma.com/api/mcp/asset/fda45d2d-d864-41c1-ab0e-35986e8389c4",
    title: "나눔의 부담감",
    description: "기쁨의 헌신이 아닌, 의무와 계산에 사로 잡힌 인색한 마음",
  },
];

const msigAreas = [
  ["M", "Mission Income", "소득", "하나님이 맡기신 역할과 사명 안에서 건강하게 소득을 형성하고 유지하는 태도 점검"],
  ["S", "Stewardship Management", "관리", "청지기적 관점에서 수입, 지출, 소비 습관, 예산 운영, 재정 질서와 관리 역량 점검"],
  ["I", "Investment Growth", "투자", "분별력과 책임감을 바탕으로 자산을 형성하는 태도 점검, 무리한 투기 방지"],
  ["G", "Giving & Generosity", "나눔", "헌금, 나눔, 섬김, 흘려보냄의 태도 점검, 신앙과 경제의 연결성 회복"],
];

const generationLabels = [
  {
    key: "youth",
    eyebrow: "YOUTH",
    title: "청년 세대",
    color: "#f04d5a",
    titleColor: "#301010",
    glow: "rgba(234,139,154,0.2)",
    x: 51,
    y: 300.3,
    align: "left",
  },
  {
    key: "newlyweds",
    eyebrow: "NEWLYWEDS",
    title: "신혼 부부",
    color: "#fcba3f",
    titleColor: "#301d10",
    glow: "rgba(249,183,78,0.2)",
    x: 988,
    y: 675.3,
    align: "right",
  },
  {
    key: "middle-age",
    eyebrow: "MIDDLE-AGED",
    title: "장년 세대",
    color: "#43cd39",
    titleColor: "#081906",
    glow: "rgba(113,233,65,0.2)",
    x: 60,
    y: 1085.3,
    align: "left",
  },
  {
    key: "senior",
    eyebrow: "MIDDLE-AGED",
    title: "장년 세대",
    color: "#3957cd",
    titleColor: "#0e1531",
    glow: "rgba(78,115,249,0.2)",
    x: 975,
    y: 1469.3,
    align: "right",
  },
];

const generationBubbles = [
  {
    key: "youth-1",
    text: "\"취업도 안 됐는데 빚은 쌓이고... 어디서부터 시작해야 할지 모르겠어요.\"",
    color: "rgba(255,126,126,0.7)",
    x: 296,
    y: 454.3,
    width: 326.4,
    tailAlign: "center",
    tailFlip: true,
  },
  {
    key: "youth-2",
    text: "\"카드값, 월세, 적금, 다 챙기려니 매달 숨이 막혀요.\"",
    color: "rgba(255,126,126,0.7)",
    x: 110,
    y: 703.3,
    width: 332.8,
    tailAlign: "left",
    tailFlip: false,
  },
  {
    key: "newlyweds-1",
    text: "\"저축이냐 소비냐, 돈 얘기만 나오면 싸워요. 같은 방향을 보고 싶은데...\"",
    color: "rgba(236,179,65,0.7)",
    x: 665,
    y: 851.3,
    width: 332.8,
    tailAlign: "left",
    tailFlip: false,
  },
  {
    key: "newlyweds-2",
    text: "\"둘 다 버는데 왜 돈이 안 모이는지 정말 모르겠어요.\"",
    color: "rgba(236,179,65,0.7)",
    x: 865,
    y: 1099.3,
    width: 326.4,
    tailAlign: "center",
    tailFlip: true,
  },
  {
    key: "middle-age-1",
    text: "\"애 학원비에 노후 준비까지, 어디서 돈이 새는지 모르겠어요.\"",
    color: "rgba(58,163,60,0.7)",
    x: 85,
    y: 1249.3,
    width: 326.4,
    tailAlign: "center",
    tailFlip: true,
  },
  {
    key: "middle-age-2",
    text: "\"대출은 아직 남았고, 은퇴는 다가오는데 뭘 먼저 해야 할지...\"",
    color: "rgba(58,163,60,0.7)",
    x: 245,
    y: 1512.3,
    width: 332.8,
    tailAlign: "left",
    tailFlip: false,
  },
  {
    key: "senior-1",
    text: "\"수입이 끊기고 나니 매달이 불안해요. 남은 자산을 어떻게 지켜야 할까요?\"",
    color: "rgba(59,94,237,0.7)",
    x: 858,
    y: 1645.3,
    width: 332.8,
    tailAlign: "left",
    tailFlip: false,
  },
  {
    key: "senior-2",
    text: "\"자식한테 짐이 되기 싫어서 혼자 고민하다 지쳐요.\"",
    color: "rgba(59,94,237,0.7)",
    x: 655,
    y: 1905.3,
    width: 326.4,
    tailAlign: "center",
    tailFlip: true,
  },
];

const serviceSteps = [
  {
    icon: serviceStepIcon1,
    iconBox: "rgba(164,50,72,0.16)",
    title: "심리적 동기 분석",
    description: "돈에 대한 두려움, 탐욕, 자존감 등 당신의 무의식속에 자리 잡은 심리 기제를 파악합니다.",
    iconClass: "h-5 w-[19.012px]",
  },
  {
    icon: serviceStepIcon2,
    iconBox: "rgba(255,141,35,0.16)",
    title: "성경적 원리 정립",
    description: "말씀이 말하는 청지기 정신과 경제관을 통해 현재 나의 위치를 재정립합니다.",
    iconClass: "h-4 w-[22px]",
  },
  {
    icon: serviceStepIcon3,
    iconBox: "rgba(29,166,89,0.16)",
    title: "유형별 맞춤 처방",
    description: "진단 결과를 바탕으로 구체적인 실천 방안과 영성 훈련 가이드를 제공합니다.",
    iconClass: "h-5 w-[18px]",
  },
  {
    icon: serviceStepIcon4,
    iconBox: "rgba(87,145,239,0.16)",
    title: "심화 전문가 상담",
    description: "필요 시 전문 상담가와 함께 더 깊은 내면의 치유와 회복을 위한 1:1 세션을 연결합니다.",
    iconClass: "h-5 w-5",
  },
];

function BubbleTail({ align = "left", color, flip = false }: { align?: "center" | "left"; color: string; flip?: boolean }) {
  const tail = (
    <div className="flex h-[35.334px] w-[27px] items-center justify-center">
      <div className="-rotate-90 -scale-y-100">
        <div className="h-[27px] w-[35.334px] [clip-path:polygon(0_50%,100%_0,100%_100%)]" style={{ background: color }} />
      </div>
    </div>
  );

  if (flip) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="w-full rotate-180 -scale-y-100">
          <div className="flex w-full items-center pl-[3.75rem]">{tail}</div>
        </div>
      </div>
    );
  }

  return <div className={align === "center" ? "flex w-full items-center justify-center" : "flex w-full items-center pl-[3.75rem]"}>{tail}</div>;
}

export default function InfoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7f5]">
      <section className="relative flex min-h-[720px] items-center justify-center overflow-hidden bg-[#fff7f5] px-0 pb-32 pt-40 [@media(min-height:760px)]:min-h-[100svh] [@media(min-height:980px)]:min-h-[900px] max-lg:px-6 max-lg:pb-18 max-lg:pt-28">
        <div className="absolute -left-[164px] top-[584px] h-[800px] w-[800px] rounded-full bg-[rgba(193,133,144,0.1)] blur-[32px]" />
        <div className="absolute left-[728px] top-16 h-[520px] w-[520px] rounded-full bg-[rgba(255,172,117,0.1)] blur-[32px]" />

        <LandingHeader />

        <div className="relative z-20 flex w-full max-w-[1280px] items-center justify-between px-[60px] py-[62px] max-lg:flex-col max-lg:gap-12 max-lg:px-0 max-lg:pt-12">
          <div className="flex min-w-0 flex-col items-start justify-center gap-8 max-lg:items-center max-lg:gap-6 max-lg:text-center">
            <div className="inline-flex items-center gap-3 rounded bg-[#ffe2db] px-4 py-1.5 text-[#4a3136] max-lg:hidden">
              <img className="h-3 w-3" alt="" src={badgeIcon} />
              <span className="whitespace-nowrap text-[0.625rem] font-medium uppercase leading-[0.9375rem] tracking-[0.125rem]">Gentle stewardship</span>
            </div>
            <h1 className="text-display font-extrabold text-[#615557] lg:text-h1-desktop xl:text-display-desktop">
              돈 앞에 무너지지 않는
              <br />
              크리스천으로 산다는 것
            </h1>
            <p className="text-body-m font-medium text-[rgba(97,85,87,0.8)] xl:text-body-l-desktop">
              단순한 자산 관리를 넘어, 당신의 경제 생활 속에 숨겨진 영성을 진단합니다.<br />
              하나님 나라의 청지기로서 평안과 질서를 회복하는 여정을 시작하세요.
            </p>
            <a className="mt-[16.7px] inline-flex min-h-[52px] items-center justify-center gap-3 rounded bg-[#d47182] px-7 py-4 text-center text-h4 font-extrabold !text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),0_4px_4px_rgba(146,75,87,0.25)] transition hover:-translate-y-0.5 hover:brightness-[1.03] lg:px-8 lg:py-3 lg:text-h4 xl:min-h-[60px]" href="/diagnosis/info">
              테스트 시작
              <img className="h-[15px] w-[15px] brightness-0 invert" alt="" src={arrowIcon} />
            </a>
          </div>

          <div className="relative flex-[0_0_444.8px] max-lg:w-full max-lg:max-w-[420px] max-lg:flex-auto">
            <div className="h-[492.8px] w-[444.8px] overflow-hidden rounded-[19.2px] shadow-[0_20px_40px_-9.6px_rgba(0,0,0,0.25)] max-lg:aspect-[444.8/492.8] max-lg:h-auto max-lg:w-full">
              <img className="block h-full w-full object-cover" alt="성경 위 십자가를 들고 묵상하는 사람" src={heroImage} />
            </div>
            <blockquote className="absolute -bottom-[24.2px] -left-6 m-0 max-w-[360px] rounded-2xl bg-[rgba(255,255,255,0.7)] px-6 py-6 pr-9 text-sm font-light leading-5 text-[#24191a] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-[6px] max-lg:-bottom-5 max-lg:left-4 max-lg:max-w-[calc(100%-32px)] max-lg:px-5 max-lg:py-[18px]">
              <p className="whitespace-nowrap font-light">"내 보물 있는 그 곳에는 네 마음도 있느니라"</p>
              <cite className="block not-italic">마태복음 6:21</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section
        className="relative flex min-h-[52.625rem] flex-col items-start justify-center overflow-hidden bg-[#433739] px-6 py-28 text-[#fff5f0] lg:px-[60px] lg:py-[120px]"
        id="process"
      >
        <img className="pointer-events-none absolute left-[860px] top-[820px] h-[500px] w-[720px] max-w-none" alt="" src={section2Shape} />

        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-[72px]">
          <div className="flex max-w-[880px] flex-col items-start gap-6">
            <span className="text-body-m font-medium uppercase tracking-[0.0625rem] text-[#f3b5c1] lg:text-h3">WHY IT MATTERS</span>
            <div className="flex flex-col gap-8">
              <h2 className="text-display font-extrabold leading-tight text-[#fff5f0] lg:text-h1-desktop xl:text-display-desktop">
                우리가 외면해 온 질문
              </h2>
              <p className="text-body-m font-medium text-[#f3dede] lg:text-body-l-desktop">
                교회는 오랫동안 돈 이야기를 불편해했습니다. 영적인 것과 경제적인 것을 분리해왔고,
                <br className="max-lg:hidden" />
                “믿음으로 살면 된다” 라는 말 뒤에 현실의 고통을 감추어 왔습니다.
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {hiddenQuestions.map((question) => (
              <article className="flex min-h-[242px] flex-col items-start gap-3 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(242,216,220,0.1)] p-[33px] shadow-[0_4px_6px_rgba(0,0,0,0.15)] backdrop-blur-[6px] max-lg:min-h-[220px] max-lg:p-7" key={question.title}>
                <img className="h-9 w-9" alt="" src={question.icon} />
                <h3 className="pt-1 text-h3 font-extrabold text-[#ffe4e6]">{question.title}</h3>
                <p className="text-body-s font-medium text-[#ded2d2] opacity-80 lg:text-body-m">
                  {question.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white text-[#140404]">
        <div className="mx-auto hidden w-full max-w-[1280px] px-6 pt-20 md:flex md:flex-col md:items-end lg:px-[60px] lg:pt-[120px]">
          <div className="flex flex-col items-end gap-6 text-right">
            <span className="text-body-m font-medium uppercase tracking-[0.0625rem] text-[#dc667b] lg:text-h3">WHO NEEDS THIS</span>
            <h2 className="text-display font-extrabold leading-tight text-[#140404] lg:text-h1-desktop xl:text-display-desktop">교회 안에서 나타나는 세대별 고민</h2>
          </div>
        </div>

        <div className="mx-auto hidden w-full overflow-visible pb-20 md:flex md:h-[73.5rem] md:justify-center min-[900px]:h-[81.13rem] lg:h-[86.5rem] min-[1150px]:h-[97.86rem] xl:h-[114.55rem]">
          <div className="relative h-[133.75rem] w-[1280px] shrink-0 origin-top scale-[0.63] -translate-y-[15.75rem] min-[900px]:scale-[0.7] min-[900px]:-translate-y-[17.5rem] lg:scale-[0.75] lg:-translate-y-[18.75rem] min-[1150px]:scale-[0.855] min-[1150px]:-translate-y-[21.5rem] xl:scale-100 xl:-translate-y-[24.2rem]">
            <div className="pointer-events-none absolute -left-24 -top-24 h-[31.25rem] w-[31.25rem] rounded-full bg-[rgba(249,168,212,0.3)] opacity-25 blur-[40px]" />
            <div className="absolute left-[-226px] top-[412.3px] h-[526px] w-[979px] rotate-180 rounded-r-[1000px] bg-[radial-gradient(circle_at_80%_50%,rgba(234,139,154,0.2)_0%,rgba(246,199,207,0)_28%)] blur-[12px]" />
            <div className="absolute left-[519px] top-[802.3px] h-[526px] w-[979px] scale-y-[-1] rounded-r-[1000px] bg-[radial-gradient(circle_at_80%_50%,rgba(249,183,78,0.2)_0%,rgba(249,183,78,0)_28%)] blur-[12px]" />
            <div className="absolute left-[-226px] top-[1206.3px] h-[526px] w-[979px] rotate-180 rounded-r-[1000px] bg-[radial-gradient(circle_at_80%_50%,rgba(113,233,65,0.2)_0%,rgba(113,233,65,0)_28%)] blur-[12px]" />
            <div className="absolute left-[519px] top-[1602.3px] h-[526px] w-[979px] scale-y-[-1] rounded-r-[1000px] bg-[radial-gradient(circle_at_80%_50%,rgba(78,115,249,0.2)_0%,rgba(78,115,249,0)_28%)] blur-[12px]" />

            {generationLabels.map((label) => (
              <div
                className="absolute flex flex-col gap-2 rounded-xl px-6 py-4"
                key={label.key}
                style={{
                  left: label.x,
                  top: label.y,
                  alignItems: label.align === "right" ? "flex-end" : "flex-start",
                  textAlign: label.align === "right" ? "right" : "left",
                }}
              >
                <span className="text-h3 font-extrabold uppercase leading-6" style={{ color: label.color }}>
                  {label.eyebrow}
                </span>
                <h3 className="pt-1 text-h1 font-extrabold leading-none" style={{ color: label.titleColor }}>
                  {label.title}
                </h3>
              </div>
            ))}

            {generationBubbles.map((bubble) => (
              <div
                className="absolute flex flex-col items-start"
                key={bubble.key}
                style={{
                  left: bubble.x,
                  top: bubble.y,
                  width: bubble.width,
                }}
              >
                <div className="flex items-center justify-center overflow-hidden rounded-[0.9rem] px-8 py-[38.4px]" style={{ background: bubble.color }}>
                  <p className="w-[16.8rem] text-h3 font-medium leading-9 text-white">{bubble.text}</p>
                </div>
                <BubbleTail align={bubble.tailAlign as "center" | "left"} color={bubble.color} flip={bubble.tailFlip} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-6 pb-28 pt-20 md:hidden">
          <div className="pointer-events-none absolute -left-24 -top-24 h-[31.25rem] w-[31.25rem] rounded-full bg-[rgba(249,168,212,0.3)] opacity-25 blur-[40px]" />
          <div className="relative z-10 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-body-m font-medium uppercase tracking-[0.0625rem] text-[#dc667b]">WHO NEEDS THIS</span>
              <h2 className="text-display font-extrabold leading-tight text-[#140404]">교회 안에서 나타나는 세대별 고민</h2>
            </div>

            {generationLabels.map((label) => {
              const bubbles = generationBubbles.filter((bubble) => bubble.key.startsWith(label.key));

              return (
                <article className="relative flex flex-col gap-5" key={label.key}>
                  <div className="flex flex-col gap-2">
                    <span className="text-h4 font-extrabold uppercase leading-6" style={{ color: label.color }}>
                      {label.eyebrow}
                    </span>
                    <h3 className="text-h2 font-extrabold leading-tight" style={{ color: label.titleColor }}>
                      {label.title}
                    </h3>
                  </div>
                  <div className="grid justify-items-center gap-4 sm:grid-cols-2">
                    {bubbles.map((bubble) => (
                      <div className="w-full max-w-[20.4rem]" key={bubble.key}>
                        <div className="flex min-h-[8.25rem] items-center justify-center overflow-hidden rounded-[0.9rem] px-8 py-8" style={{ background: bubble.color }}>
                          <p className="text-body-m font-medium leading-7 text-white">{bubble.text}</p>
                        </div>
                        <BubbleTail color={bubble.color} />
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[720px] flex-col items-center justify-center gap-[60px] overflow-hidden bg-[#52494b] px-[60px] py-[100px] text-[#fff7f5] [@media(min-height:760px)]:min-h-[100svh] [@media(min-height:980px)]:min-h-[900px] max-lg:px-6 max-lg:py-28" id="archetypes">
        <div className="pointer-events-none absolute -right-[200px] top-[120px] h-[420px] w-[620px] rotate-[28deg] rounded-[48%] border-4 border-[rgba(207,190,190,0.22)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1120px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <span className="text-body-m font-medium uppercase tracking-[0.0625rem] text-[#f3b5c1] lg:text-h3">MSIG Framework</span>
            <h2 className="text-display font-extrabold leading-tight text-[#e7dede] lg:text-h1-desktop xl:text-display-desktop">
              MSIG 경제영성 진단 프로그램이란
            </h2>
            <p className="text-body-m font-light text-[rgba(255,247,245,0.76)] lg:text-body-l-desktop">
              MSIG는 성도의 경제영성을 네 가지 핵심 영역으로 분석하는 진단 프로그램입니다. 단순히 재정 상태만을 파악하는 것이 아니라, 삶 속에서 재정을 어떻게 이해하고 관리하며 흘려보내고
              있는지를 입체적으로 점검하도록 설계되어 있습니다. 경제는 신앙의 열매라는 관점에서, 성도들이 하나님이 맡기신 재정을 지혜롭게 관리하고 성장하도록 돕는 도구입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {msigAreas.map(([initial, label, title, description]) => (
              <article className="rounded-lg border border-[rgba(255,247,245,0.12)] bg-[#5f5557] p-6 shadow-[0_18px_40px_rgba(36,25,26,0.18)]" key={label}>
                <div className="mb-8 flex items-center justify-between gap-4">
                  <strong className="flex h-12 w-12 items-center justify-center rounded bg-[#f3b5c1] text-h3 font-extrabold text-[#52494b]">{initial}</strong>
                  <span className="text-label font-extrabold uppercase tracking-[0.14rem] text-[#cfbebe]">{label}</span>
                </div>
                <h3 className="mb-3 text-h3 font-extrabold text-[#fff7f5]">{title}</h3>
                <p className="text-body-s font-light text-[rgba(255,247,245,0.7)]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-24 bg-[#fff0f0] px-6 py-24 text-center lg:gap-[160px] lg:px-[60px] lg:py-[120px]">
        <div className="flex w-full flex-col items-center gap-[60px]">
          <div className="flex flex-col items-center gap-6">
            <span className="text-body-m font-medium uppercase tracking-[0.0625rem] text-[#dc667b] lg:text-h3">4-STEP DIAGNOSIS</span>
            <h2 className="text-display font-extrabold leading-tight text-[#140404] lg:text-h1-desktop xl:text-display-desktop">
              체계적인 4단계 종합 진단
            </h2>
          </div>

          <div className="grid w-full max-w-[1280px] grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
            {serviceSteps.map((step) => (
              <article className="flex min-h-[242px] flex-col items-start gap-3 rounded-2xl bg-white p-[33px] shadow-[0_4px_6px_rgba(0,0,0,0.15)] backdrop-blur-[6px] max-lg:min-h-[220px] max-lg:p-7" key={step.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: step.iconBox }}>
                  <img className={step.iconClass} alt="" src={step.icon} />
                </div>
                <h3 className="pt-1 text-h3 font-extrabold text-[#3b191b]">{step.title}</h3>
                <p className="text-body-s font-medium text-[#785a5a] opacity-80 lg:text-body-m">{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-[1024px] overflow-hidden rounded-[24px] bg-gradient-to-r from-[#d47182] to-[#c44b5f] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] lg:p-12">
          <div className="absolute right-[827px] top-[7.6px] h-64 w-64 rounded-full bg-[rgba(255,255,255,0.1)] blur-[32px]" />
          <div className="absolute -right-[120px] top-[66.6px] h-[400px] w-[400px] rounded-full bg-[rgba(255,255,255,0.1)] blur-[32px]" />
          <div className="absolute -bottom-[96.79px] -left-24 h-64 w-64 rounded-full blur-[32px]" />
          <div className="relative z-10 flex flex-col items-center gap-[23px]">
            <h2 className="pb-[17.6px] text-center text-h2 font-extrabold leading-tight text-white lg:text-h1-desktop">
              지금, 당신의 경제 영성은 어떤지 확인해보세요
            </h2>
            <a className="relative inline-flex min-h-[4.3rem] items-center justify-center rounded-2xl bg-white px-12 py-5 text-center text-h4 font-extrabold text-[#a43248] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] transition hover:-translate-y-0.5 hover:brightness-[1.02] lg:text-h4-desktop" href="/diagnosis/part/1">
              진단 시작하기
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
