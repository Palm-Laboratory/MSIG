import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer flex min-h-[7.5rem] w-full items-center justify-between bg-[#52494b] px-8 py-12 text-[rgba(255,255,255,0.8)] max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-6 max-[767px]:px-6 max-[767px]:py-9">
      <div className="flex min-w-0 flex-col items-start gap-2">
        <strong className="text-lg font-medium leading-7 text-[rgba(255,255,255,0.9)]">복음경제영성연구소</strong>
        <p className="text-caption font-light leading-4 tracking-[0.01875rem] text-[rgba(255,255,255,0.6)]">© 2026 복음경제영성연구소. All rights reserved provided by Baos Lab</p>
      </div>
      <nav className="flex items-start gap-8 max-[767px]:flex-wrap max-[767px]:gap-x-6 max-[767px]:gap-y-3" aria-label="푸터 링크">
        <Link className="text-caption font-light leading-4 tracking-[0.01875rem] text-[rgba(255,255,255,0.8)] transition hover:text-white" href="/terms">
          이용약관
        </Link>
        <Link className="text-caption font-light leading-4 tracking-[0.01875rem] text-[rgba(255,255,255,0.8)] transition hover:text-white" href="/privacy">
          개인정보처리방침
        </Link>
      </nav>
    </footer>
  );
}
