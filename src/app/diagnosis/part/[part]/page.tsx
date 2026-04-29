import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ part: string }>;
};

const parts = [
  { label: "PART 1.", active: true },
  { label: "PART 2.", active: false },
  { label: "PART 3.", active: false },
] as const;

const choices = ["매우 아니다", "아니다", "보통이다", "그렇다", "매우 그렇다"] as const;

export default async function DiagnosisPartPage({ params }: Props) {
  const { part } = await params;

  if (!["1", "2", "3"].includes(part)) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffefe] font-sans text-[#1c1c19]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-[rgba(249,168,212,0.3)] opacity-25 blur-[40px]" />
      <div className="pointer-events-none absolute left-[57%] top-[355px] h-[270px] w-[600px] rounded-full bg-[rgba(254,215,170,0.4)] opacity-25 blur-[40px]" />

      <header className="relative z-10 flex w-full flex-col items-center bg-[rgba(255,249,250,0.8)] pb-2 shadow-[0_1px_1px_rgba(28,28,25,0.05)] backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-5 py-4 md:px-6">
          <h1 className="text-[16px] font-medium leading-7 tracking-[-0.025em] md:text-[18px]">PART 1. 6대 성경 인물 역량 진단 (40문항)</h1>
          <span className="whitespace-nowrap text-[16px] font-medium leading-none text-[#d47182]">1 / 40</span>
        </div>
        <div className="flex h-[6px] w-[calc(100%-40px)] items-start gap-1 md:w-[calc(100%-48px)]">
          <div className="h-full w-[30px] rounded-full bg-[#8c4752]" />
          <div className="h-full flex-1 rounded-full bg-[#efdfdf]" />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-[46px] px-5 pb-8 pt-[54px] md:px-8 md:pt-[58px] lg:gap-[60px] lg:px-0 lg:pb-5">
        <div className="mx-auto flex w-full max-w-[672px] flex-col gap-2.5 lg:mx-0 lg:ml-[304px]">
          <p className="text-[14px] font-medium uppercase leading-5 tracking-[0.1em] text-[#b6737d]">첫번째 인물</p>
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.021em] md:text-[36px] md:leading-[37.5px]">아브라함의 믿음 - 경제 마인드셋 (7문항)</h2>
        </div>

        <div className="relative">
          <article className="mx-auto flex w-full max-w-[672px] flex-col gap-10 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.8)] px-5 py-8 shadow-[0_4px_6px_rgba(0,0,0,0.1)] md:gap-12 md:px-9 md:py-10 lg:mx-0 lg:ml-[304px]">
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-[18px] font-medium leading-7 text-[#8c4752]">01.</span>
              <h3 className="text-[18px] font-medium leading-8 md:text-[20px]">나는 하나님이 나의 모든 재정의 주인이심을 진심으로 믿는다.</h3>
            </div>

            <div className="grid gap-3 rounded-lg border border-[rgba(0,0,0,0.04)] bg-[#fffdfd] px-4 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.1)] min-[720px]:grid-cols-5 min-[720px]:gap-0 min-[720px]:px-[31px] min-[720px]:py-[17px]">
              {choices.map((choice) => {
                const selected = choice === "매우 그렇다";

                return (
                  <button
                    aria-pressed={selected}
                    className="flex min-h-12 items-center gap-3 rounded-md px-2 text-left min-[720px]:flex-col min-[720px]:justify-center min-[720px]:gap-1 min-[720px]:px-0 min-[720px]:text-center"
                    key={choice}
                    type="button"
                  >
                    <span
                      className={
                        selected
                          ? "grid size-5 place-items-center rounded-full border-4 border-[rgba(255,169,173,0.4)] bg-[#f27c7c] text-[11px] font-bold leading-none text-white"
                          : "size-5 rounded-full border border-[#d6c2c3]"
                      }
                    >
                      {selected ? "✓" : null}
                    </span>
                    <span className={selected ? "text-[16px] font-medium leading-6 text-[#e55f5f]" : "text-[16px] font-light leading-6 text-[#1c1c19]"}>{choice}</span>
                  </button>
                );
              })}
            </div>

            <aside className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.04)] bg-[#fffdfd] px-[30px] py-8 shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-[rgba(140,71,82,0.05)] blur-[32px]" />
              <div className="relative flex flex-col gap-[15px]">
                <div className="flex items-center gap-2">
                  <span className="grid size-3 place-items-center rounded-full border border-[#6d5750] text-[8px] font-bold leading-none text-[#6d5750]">i</span>
                  <strong className="text-[12px] font-bold uppercase leading-4 tracking-[0.1em] text-[#6d5750]">RELATED VERSES</strong>
                </div>
                <p className="text-[14px] font-medium leading-[22.75px] text-[#6d5750]">"은도 내 것이요 금도 내 것이니라 만군의 여호와의 말이니라" (학 2:8)</p>
              </div>
            </aside>
          </article>

          <nav className="hidden lg:absolute lg:left-[1108px] lg:top-[86px] lg:mt-0 lg:flex lg:justify-start" aria-label="진단 파트 진행 상태">
            <ol className="flex flex-col items-stretch gap-5">
              {parts.map((item) => (
                <li className="flex w-[118px] items-center justify-end gap-[11px] lg:w-[138px]" key={item.label}>
                  <span className={item.active ? "text-[14px] font-medium uppercase leading-5 tracking-[0.1em] text-[#b6737d]" : "text-[14px] font-medium uppercase leading-5 tracking-[0.1em] text-[#d6c2c3]"}>{item.label}</span>
                  <span className={item.active ? "h-px w-8 bg-[#b6737d]" : "h-px w-8 bg-[#d6c2c3]"} />
                  <span className={item.active ? "size-5 rounded-full bg-[linear-gradient(148deg,#e57385_12.31%,#ff8c9e_80.77%)]" : "size-5 rounded-full border border-[#d6c2c3]"} />
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <footer className="mx-auto flex w-full max-w-[672px] flex-col gap-4 border-t border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.7)] pt-6 backdrop-blur-xl sm:flex-row sm:gap-6 lg:mx-0 lg:ml-[304px]">
          <Link className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded bg-[linear-gradient(156deg,#ffebeb_30.73%,#fff5f5_67%)] text-[16px] font-medium text-[#524345] shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)] transition hover:-translate-y-0.5" href="/diagnosis/info">
            <span aria-hidden="true">←</span>
            이전
          </Link>
          <button className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded bg-[linear-gradient(156deg,#d47182_30.73%,#e68798_67%)] text-[16px] font-medium text-white shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)] transition hover:-translate-y-0.5" type="button">
            다음
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      </section>
    </main>
  );
}
