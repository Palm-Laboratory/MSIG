import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";

const heroImage = "https://www.figma.com/api/mcp/asset/e25fe8f4-de54-42bc-9c64-7185c6736aaf";
const badgeIcon = "https://www.figma.com/api/mcp/asset/1104be0c-3e0b-4969-a9dc-2db15bee3f47";
const arrowIcon = "https://www.figma.com/api/mcp/asset/1468db5d-6b4c-47ff-a666-ccc99c58ca86";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7f5]">
      <section className="relative flex min-h-[720px] items-center justify-center overflow-hidden bg-[#fff7f5] px-0 pb-32 pt-40 [@media(min-height:760px)]:min-h-[100svh] [@media(min-height:980px)]:min-h-[900px] max-[900px]:px-6 max-[900px]:pb-18 max-[900px]:pt-28">
        <div className="absolute -left-[164px] top-[584px] h-[800px] w-[800px] rounded-full bg-[rgba(193,133,144,0.1)] blur-[32px]" />
        <div className="absolute left-[728px] top-16 h-[520px] w-[520px] rounded-full bg-[rgba(255,172,117,0.1)] blur-[32px]" />

        <LandingHeader />

        <div className="relative z-20 flex w-full max-w-[1280px] items-center justify-between px-[60px] py-[62px] max-[900px]:flex-col max-[900px]:gap-12 max-[900px]:px-0 max-[900px]:pt-12">
          <div className="flex min-w-0 flex-col items-start justify-center gap-8 max-[900px]:items-center max-[900px]:gap-6 max-[900px]:text-center">
            <div className="inline-flex items-center gap-3 rounded bg-[#ffe2db] px-4 py-1.5 text-[#4a3136] max-[900px]:hidden">
              <img className="h-3 w-3" alt="" src={badgeIcon} />
              <span className="whitespace-nowrap text-[0.625rem] font-medium uppercase leading-[0.9375rem] tracking-[0.125rem]">Gentle stewardship</span>
            </div>
            <h1 className="text-display font-extrabold text-[#615557] md:text-display-desktop">
              돈 앞에 무너지지 않는
              <br />
              크리스천으로 산다는 것
            </h1>
            <p className="text-body-m font-medium text-[rgba(97,85,87,0.8)] md:text-body-l-desktop">
              단순한 자산 관리를 넘어, 당신의 경제 생활 속에 숨겨진 영성을 진단합니다.
              하나님 나라의 청지기로서 평안과 질서를 회복하는 여정을 시작하세요.
            </p>
            <a className="mt-[16.7px] inline-flex min-h-[52px] items-center justify-center gap-3 rounded bg-[#d47182] px-7 py-4 text-center text-h4 font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),0_4px_4px_rgba(146,75,87,0.25)] transition hover:-translate-y-0.5 hover:brightness-[1.03] md:min-h-[60px] md:px-10 md:py-5 md:text-h3-desktop" href="/diagnosis/info">
              테스트 시작
              <img className="h-[15px] w-[15px]" alt="" src={arrowIcon} />
            </a>
          </div>

          <div className="relative flex-[0_0_444.8px] max-[900px]:w-full max-[900px]:max-w-[420px] max-[900px]:flex-auto">
            <div className="h-[492.8px] w-[444.8px] overflow-hidden rounded-[19.2px] shadow-[0_20px_40px_-9.6px_rgba(0,0,0,0.25)] max-[900px]:aspect-[444.8/492.8] max-[900px]:h-auto max-[900px]:w-full">
              <img className="block h-full w-full object-cover" alt="성경 위 십자가를 들고 묵상하는 사람" src={heroImage} />
            </div>
            <blockquote className="absolute -bottom-[24.2px] -left-6 m-0 max-w-[360px] rounded-2xl bg-[rgba(255,255,255,0.7)] px-6 py-6 pr-9 text-sm font-light leading-5 text-[#24191a] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-[6px] max-[900px]:-bottom-5 max-[900px]:left-4 max-[900px]:max-w-[calc(100%-32px)] max-[900px]:px-5 max-[900px]:py-[18px]">
              <p className="whitespace-nowrap font-light">"내 보물 있는 그 곳에는 네 마음도 있느니라"</p>
              <cite className="block not-italic">마태복음 6:21</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section
        className="relative flex min-h-[720px] flex-col items-center overflow-hidden bg-[#615557] bg-cover bg-center bg-no-repeat px-[60px] py-[115px] text-[#fff5f0] [@media(min-height:760px)]:min-h-[100svh] [@media(min-height:980px)]:min-h-[900px] max-[900px]:px-6 max-[900px]:py-35"
        id="process"
        style={{ backgroundImage: 'url("https://www.figma.com/api/mcp/asset/68db41fe-e8a4-4ad5-9cce-e6a0e6b29ec8")' }}
      />

      <section className="relative flex min-h-[720px] flex-col items-center gap-[60px] overflow-hidden bg-[#52494b] px-[60px] py-[100px] text-[#fff7f5] [@media(min-height:760px)]:min-h-[100svh] [@media(min-height:980px)]:min-h-[900px] max-[900px]:px-6 max-[900px]:py-35" id="archetypes">
        <div className="pointer-events-none absolute -right-[200px] top-[120px] h-[420px] w-[620px] rotate-[28deg] rounded-[48%] border-4 border-[rgba(207,190,190,0.22)]" />
      </section>

      <section className="flex min-h-[720px] flex-col items-center gap-[60px] bg-[radial-gradient(circle_at_96%_16%,rgba(235,197,138,0.2),transparent_30%),radial-gradient(circle_at_8%_75%,rgba(255,99,216,0.14),transparent_28%),linear-gradient(180deg,#fff1f1_0%,#fff7e9_100%)] px-[60px] py-[100px] text-center [@media(min-height:760px)]:min-h-[100svh] [@media(min-height:980px)]:min-h-[900px] max-[900px]:gap-20 max-[900px]:px-6 max-[900px]:pb-[220px] max-[900px]:pt-40" />

      <SiteFooter />
    </main>
  );
}
