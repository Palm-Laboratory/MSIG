import Link from "next/link";
import { LandingProcessCard } from "@/components/landing-process-card";

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
  ["아브라함", "믿음의 모험가"],
  ["나발", "수전노"],
  ["야곱형", "전략적 사냥꾼"],
  ["발람", "물질 숭배"],
  ["엘리야", "지친 전사"],
  ["아간", "일확천금 추구"],
  ["탕자", "낭비가"],
  ["므비보셋", "경제적 미성숙"],
];

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero">
        <div className="landing-blur landing-blur-left" />
        <div className="landing-blur landing-blur-right" />

        <nav className="landing-nav" aria-label="메인 내비게이션">
          <Link className="landing-brand" href="/">
            <strong>복음경제영성 종합 진단</strong>
            <span>한국교회 목회지원센터</span>
          </Link>
          <div className="landing-links">
            <a className="active" href="#process">
              검사 과정
            </a>
            <a href="#archetypes">결과 유형</a>
            <Link href="/result">나의 결과</Link>
            <a href="#faq">FAQ</a>
          </div>
          <details className="landing-mobile-nav">
            <summary aria-label="메뉴 열기">
              <span />
              <span />
              <span />
            </summary>
            <div>
              <a href="#process">검사 과정</a>
              <a href="#archetypes">결과 유형</a>
              <Link href="/result">나의 결과</Link>
              <a href="#faq">FAQ</a>
            </div>
          </details>
        </nav>

        <div className="landing-hero-copy">
          <div className="landing-pill">✦ DISCOVER YOUR BIBLICAL IDENTITY</div>
          <h1>
            나의 경제 습관,
            <br />
            성경의 어떤 인물과 닮았을까?
          </h1>
          <p>
            당신의 재정적 태도와 신앙의 성숙도를 정밀하게 분석하고
            <br />
            성경 속 인물을 통해 해답을 찾아보세요.
          </p>
          <Link className="landing-primary-button" href="/survey/part-1">
            테스트 시작 <span aria-hidden="true">→</span>
          </Link>
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
          {archetypes.map(([name, subtitle]) => (
            <article className="landing-character" key={name}>
              <div className="character-image-slot" aria-label={`${name} 캐릭터 이미지 준비 중`}>
                <span>이미지 준비 중</span>
              </div>
              <h3>{name}</h3>
              <p>{subtitle}</p>
            </article>
          ))}
        </div>

        <Link className="landing-outline-button" href="/result">
          전체 유형 보기
        </Link>
      </section>

      <section className="landing-cta">
        <div>
          <h2>이제 당신의 경제영성을 확인해보세요</h2>
          <p>더 깊은 상담을 원하신다면 전문가와 함께 정밀한 상담을 받아보세요.</p>
        </div>
        <div className="landing-cta-actions">
          <Link className="landing-primary-button" href="/survey/part-1">
            진단 시작하기 (무료)
          </Link>
          <a className="landing-secondary-button" href="mailto:contact@example.com?subject=MSIG%20정밀%20상담%20신청">
            정밀 상담 신청하기
          </a>
        </div>
      </section>

      <footer className="landing-footer" id="faq">
        <strong>한국목회지원센터</strong>
        <span>서울 강남구 OO로 OO길 OO타워 OO호</span>
        <span>TEL: 010-0000-0000</span>
        <span>copyright ⓒ (사)한국목회지원회 All rights reserved.</span>
      </footer>
    </main>
  );
}
