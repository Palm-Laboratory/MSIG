import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="survey-shell">
      <header className="survey-header">
        <Link className="brand-mark" href="/">
          MSIG
        </Link>
      </header>

      <section className="survey-card">
        <p className="section-kicker">About</p>
        <h1>복음경제아카데미 · 봇대형</h1>
        <p>복음경제영성 종합진단을 준비한 사역과 소개 콘텐츠가 들어갈 선택 페이지입니다.</p>
        <Link className="button primary" href="/diagnosis">
          진단 소개 보기
        </Link>
      </section>
    </main>
  );
}
