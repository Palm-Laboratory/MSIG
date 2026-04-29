import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";
import { LandingProcessCard } from "@/components/landing-process-card";
import { SiteFooter } from "@/components/site-footer";

const badgeIcon = "https://www.figma.com/api/mcp/asset/ca1f999b-965a-4692-8cd9-2958fed5160f";
const arrowIcon = "https://www.figma.com/api/mcp/asset/83745a12-4bac-4633-b2b0-1faf42dbd1fd";

const processParts = [
  {
    label: "Part 01",
    title: "6대 성경인물 역량 진단 (40문항)",
    bullets: [
      "아브라함, 다윗, 요셉, 느헤미야, 삼손, 다니엘 — 6인의 역량 중 나는 어느 쪽을 닮았는지 확인합니다.",
      "6명의 성경 인물이 가진 고유한 경제적 역량을 기준으로 나의 강점과 약점을 분석합니다.",
    ],
  },
  {
    label: "Part 02",
    title: "8대 경제장애 위험도 진단 (24문항)",
    bullets: [
      "에서, 아합, 아나니아, 아간, 어리석은 부자, 솔로몬, 한 달란트 종, 마르다 — 성경 속 8가지 경제적 실패 패턴 중 내가 빠지기 쉬운 함정을 찾아냅니다.",
      "나도 모르게 반복하는 재정적 위험 습관을 성경 인물의 사례를 통해 진단합니다.",
    ],
  },
  {
    label: "Part 03",
    title: "MSIG 행동 프로파일 진단 (16문항)",
    bullets: [
      "돈 버는 행동(Making), 쓰는 행동(Spending), 불리는 행동(Investing), 나누는 행동(Giving) — 4가지 재정 행동의 균형을 측정합니다.",
      "건강한 경제영성은 4개 영역의 균형에서 시작됩니다. 나의 강한 영역과 보완이 필요한 영역을 확인해보세요.",
    ],
  },
];

const archetypes = [
  ["아브라함", "믿음의 모험가", "/images/아브라함_.png"],
  ["나발", "수전노", "/images/나발_.png"],
  ["야곱형", "전략적 사냥꾼", "/images/야곱_.png"],
  ["발람", "물질 숭배", "/images/발람_.png"],
  ["엘리야", "지친 전사", "/images/엘리야_.png"],
  ["아간", "일확천금 추구", "/images/아간_.png"],
  ["탕자", "낭비가", "/images/탕자_.png"],
  ["므비보셋", "경제적 미성숙", "/images/므비보셋_.png"],
];

export default function DiagnosisInfoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7f5]">
      <section className="relative flex min-h-[640px] flex-col items-center overflow-hidden bg-[#fff7f5] px-6 pb-20 pt-40 [@media(min-height:760px)]:min-h-[82svh] [@media(min-height:980px)]:min-h-[760px] md:px-[120px] max-[900px]:pb-24 max-[900px]:pt-32">
        <div className="absolute -left-[164px] top-[584px] h-[800px] w-[800px] rounded-full bg-[rgba(193,133,144,0.1)] blur-[32px]" />
        <div className="absolute left-[728px] top-16 h-[520px] w-[520px] rounded-full bg-[rgba(255,172,117,0.1)] blur-[32px]" />

        <LandingHeader activeItem="검사 과정" brandHref="/diagnosis/info" items={["검사 과정", "소개", "결과 유형", "FAQ"]} label="진단 소개 내비게이션" />

        <div className="relative z-20 mx-auto flex w-full max-w-[1280px] justify-center px-0 md:px-[60px]">
          <div className="mx-auto flex min-w-0 max-w-[72rem] flex-1 flex-col items-center gap-10 text-center">
            <div className="inline-flex items-center gap-3 rounded bg-[#ffe2db] px-4 py-1.5 text-[#4a3136] max-[900px]:hidden">
              <img className="h-3 w-3" alt="" src={badgeIcon} />
              <span className="whitespace-nowrap text-[0.625rem] font-medium uppercase leading-[0.9375rem] tracking-[0.125rem]">DISCOVER YOUR BIBLICAL IDENTITY</span>
            </div>
            <h1 className="text-display whitespace-normal text-center font-extrabold text-[#615557] md:text-display-desktop min-[901px]:whitespace-nowrap">
              나의 경제 습관,
              <br />
              성경의 어떤 인물과 닮았을까?
            </h1>
            <p className="max-w-[36rem] text-center text-body-m font-medium text-[#615557] opacity-80 md:text-body-l-desktop">
              당신의 재정적 태도와 신앙의 성숙도를 정밀하게 분석하고
              <br />
              성경 속 인물을 통해 해답을 찾아보세요.
            </p>
            <div className="flex w-full justify-center pt-[46px]">
              <Link className="relative inline-flex min-h-12 items-center justify-center gap-3 rounded bg-[#d47182] px-6 py-4 text-center text-h4 font-extrabold uppercase tracking-[0.0875rem] !text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),0_4px_4px_rgba(146,75,87,0.25)] transition hover:-translate-y-0.5 hover:brightness-[1.03] md:min-h-[60px] md:px-7 md:py-3 md:text-h3-desktop" href="/diagnosis/part/1">
                <span className="text-h4">테스트 시작</span>
                <img className="text-h4 h-[15px] w-[15px] brightness-0 invert" alt="" src={arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-process" id="process">
        <div className="landing-shape shape-a" />
        <div className="landing-shape shape-b" />
        <div className="landing-section-title">
          <span>HOW IT WORKS</span>
          <h2>진단은 3단계로 진행됩니다</h2>
        </div>

        <LandingProcessCard parts={processParts} />

        <div className="process-mobile-stack">
          {processParts.map((part) => (
            <article className="process-mobile-card" key={part.label}>
              <span>{part.label}</span>
              <div>
                <h3>{part.title}</h3>
                <ul>
                  {part.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="process-time">· 예상 소요시간: 15~20분 | 총 80문항</p>
      </section>

      <section className="landing-archetypes" id="archetypes">
        <div className="landing-shape shape-c" />
        <div className="landing-section-title">
          <span>MEET YOUR BIBLICAL ARCHETYPES</span>
          <h2>당신을 기다리는 8인의 인물들</h2>
        </div>

        <div className="landing-character-grid">
          {archetypes.map(([name, subtitle, imageSrc]) => (
            <article className="landing-character" key={name}>
              <div className="character-image-slot" aria-label={imageSrc ? `${name} 캐릭터 이미지` : `${name} 캐릭터 이미지 준비 중`}>
                {imageSrc ? <img alt={`${name} 캐릭터`} src={imageSrc} /> : <span>이미지 준비 중</span>}
              </div>
              <h3>{name}</h3>
              <p>{subtitle}</p>
            </article>
          ))}
        </div>

        <Link className="landing-outline-button" href="/diagnosis/result">
          전체 유형 보기
        </Link>
      </section>

      <section className="landing-cta">
        <div>
          <h2>이제 당신의 경제영성을 확인해보세요</h2>
          <p>더 깊은 상담을 원하신다면 전문가와 함께 정밀한 상담을 받아보세요.</p>
        </div>
        <div className="landing-cta-actions">
          <Link className="inline-flex min-h-14 items-center justify-center rounded bg-[#d47182] px-10 py-5 text-center text-h4 font-black tracking-[0.0625rem] !text-white shadow-[0_10px_15px_-3px_rgba(146,75,87,0.24),0_4px_6px_-4px_rgba(146,75,87,0.24)] transition hover:-translate-y-0.5 hover:brightness-[1.03]" href="/diagnosis/part/1">
            진단 시작하기 (무료)
          </Link>
          <a className="inline-flex min-h-14 items-center justify-center rounded bg-[#7d545b] px-10 py-5 text-center text-h4 font-black tracking-[0.0625rem] !text-white transition hover:-translate-y-0.5 hover:brightness-[1.03]" href="mailto:contact@example.com?subject=MSIG%20정밀%20상담%20신청">
            정밀 상담 신청하기
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
