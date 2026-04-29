import Link from "next/link";

type LandingHeaderProps = {
  brandHref?: string;
  label?: string;
  activeItem?: string;
  items?: string[];
};

const defaultItems = ["진단 소개", "검사 과정", "결과 유형", "FAQ"];

export function LandingHeader({ brandHref = "/", label = "메인 내비게이션", activeItem = "진단 소개", items = defaultItems }: LandingHeaderProps) {
  return (
    <nav
      className="absolute inset-x-0 top-0 z-30 flex min-h-20 items-center justify-between px-8 backdrop-blur-[12px] transition-[min-height,padding,background-color] duration-200 max-[900px]:px-6"
      aria-label={label}
    >
      <Link className="flex min-w-0 max-w-[calc(100vw-5rem)] flex-col text-[#292524]" href={brandHref}>
        <strong className="text-body-m font-medium leading-[1.4] md:whitespace-nowrap md:text-h2 md:leading-[1.625]">복음경제영성 종합 진단</strong>
        <span className="text-caption font-light leading-4 text-black md:whitespace-nowrap md:text-body-m">한국교회 목회지원센터</span>
      </Link>
      <div className="flex items-center gap-10 max-[900px]:hidden">
        {items.map((item) =>
          item === "진단 소개" ? (
            <Link
              className={item === activeItem ? "border-b border-[#fecdd3] pb-[5px] text-base font-extrabold leading-6 text-[#be123c]" : "text-base font-semibold leading-6 text-[#78716c]"}
              href="/diagnosis/info"
              key={item}
            >
              {item}
            </Link>
          ) : (
            <span className={item === activeItem ? "border-b border-[#fecdd3] pb-[5px] text-base font-extrabold leading-6 text-[#be123c]" : "text-base font-semibold leading-6 text-[#78716c]"} key={item}>
              {item}
            </span>
          ),
        )}
      </div>
      <details className="relative hidden max-[900px]:block">
        <summary className="flex h-8 w-8 list-none flex-col items-center justify-center gap-[5px] p-1 [&::-webkit-details-marker]:hidden" aria-label="메뉴 열기">
          <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
          <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
          <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
        </summary>
        <div className="absolute right-0 top-[42px] grid w-40 gap-3 rounded-lg border border-[#f2dada] bg-[rgba(255,247,245,0.96)] p-4 shadow-[0_12px_28px_rgba(97,85,87,0.14)]">
          {items.map((item) =>
            item === "진단 소개" ? (
              <Link className={item === activeItem ? "text-sm font-extrabold leading-5 text-[#be123c]" : "text-sm font-extrabold leading-5 text-[#615557]"} href="/diagnosis/info" key={item}>
                {item}
              </Link>
            ) : (
              <span className={item === activeItem ? "text-sm font-extrabold leading-5 text-[#be123c]" : "text-sm font-extrabold leading-5 text-[#615557]"} key={item}>
                {item}
              </span>
            ),
          )}
        </div>
      </details>
    </nav>
  );
}
