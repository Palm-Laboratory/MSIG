import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fff7f5] px-6 py-8 text-[#1c1c19]">
      <header className="mx-auto flex max-w-[1080px] items-center justify-between">
        <Link className="inline-flex h-10 min-w-[74px] items-center justify-center rounded-md bg-[#423739] px-3.5 font-black text-[#fff7f5]" href="/">
          MSIG
        </Link>
      </header>

      <section className="mx-auto mt-12 grid max-w-[720px] gap-4 rounded-lg border border-[#efdfdf] bg-[rgba(255,255,255,0.86)] p-6 shadow-[0_14px_38px_rgba(140,71,82,0.09)]">
        <p className="text-[0.8125rem] font-black uppercase text-[#e8667a]">About</p>
        <h1 className="text-[1.625rem] font-extrabold leading-[1.2] text-[#423739] md:text-[2.5rem]">복음경제아카데미 · 봇대형</h1>
        <p className="text-[0.9375rem] leading-[1.7] text-[#78716c] md:text-base">복음경제영성 종합진단을 준비한 사역과 소개 콘텐츠가 들어갈 선택 페이지입니다.</p>
        <Link className="inline-flex min-h-[46px] items-center justify-center rounded-md bg-[#e8667a] px-[18px] font-extrabold text-white transition hover:-translate-y-px" href="/diagnosis">
          진단 소개 보기
        </Link>
      </section>
    </main>
  );
}
