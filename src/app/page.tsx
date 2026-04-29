import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";

const heroImage = "https://www.figma.com/api/mcp/asset/e25fe8f4-de54-42bc-9c64-7185c6736aaf";
const badgeIcon = "https://www.figma.com/api/mcp/asset/1104be0c-3e0b-4969-a9dc-2db15bee3f47";
const arrowIcon = "https://www.figma.com/api/mcp/asset/1468db5d-6b4c-47ff-a666-ccc99c58ca86";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero main-hero">
        <div className="landing-blur landing-blur-left" />
        <div className="landing-blur landing-blur-right" />

        <LandingHeader />

        <div className="main-hero-container">
          <div className="main-hero-copy">
            <div className="main-hero-badge">
              <img alt="" src={badgeIcon} />
              <span>Gentle stewardship</span>
            </div>
            <h1>
              돈 앞에 무너지지 않는
              <br />
              크리스천으로 산다는 것
            </h1>
            <p>
              단순한 자산 관리를 넘어, 당신의 경제 생활 속에 숨겨진 영성을 진단합니다.
              하나님 나라의 청지기로서 평안과 질서를 회복하는 여정을 시작하세요.
            </p>
            <a className="main-hero-button" href="/diagnosis/info">
              테스트 시작
              <img alt="" src={arrowIcon} />
            </a>
          </div>

          <div className="main-hero-visual">
            <div className="main-hero-image-frame">
              <img alt="성경 위 십자가를 들고 묵상하는 사람" src={heroImage} />
            </div>
            <blockquote>
              <p className="whitespace-nowrap font-light">"내 보물 있는 그 곳에는 네 마음도 있느니라"</p>
              <cite>마태복음 6:21</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="landing-process main-process-background" id="process" />

      <section className="landing-archetypes" id="archetypes">
        <div className="landing-shape shape-c" />
      </section>

      <section className="landing-cta" />

      <SiteFooter />
    </main>
  );
}
