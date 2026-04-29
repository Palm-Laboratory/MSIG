import Link from "next/link";

type LandingHeaderProps = {
  brandHref?: string;
  label?: string;
};

export function LandingHeader({ brandHref = "/", label = "메인 내비게이션" }: LandingHeaderProps) {
  return (
    <nav className="landing-nav" aria-label={label}>
      <Link className="landing-brand" href={brandHref}>
        <strong>복음경제영성 종합 진단</strong>
        <span>한국교회 목회지원센터</span>
      </Link>
      <div className="landing-links">
        <Link className="active" href="/diagnosis/info">
          진단 소개
        </Link>
        <span>검사 과정</span>
        <span>결과 유형</span>
        <span>FAQ</span>
      </div>
      <details className="landing-mobile-nav">
        <summary aria-label="메뉴 열기">
          <span />
          <span />
          <span />
        </summary>
        <div>
          <Link href="/diagnosis/info">진단 소개</Link>
          <span>검사 과정</span>
          <span>결과 유형</span>
          <span>FAQ</span>
        </div>
      </details>
    </nav>
  );
}
