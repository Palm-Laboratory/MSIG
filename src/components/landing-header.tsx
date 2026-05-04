"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

type NavItem = string | { href: string; label: string };

type LandingHeaderProps = {
  brandHref?: string;
  label?: string;
  activeItem?: string;
  items?: NavItem[];
};

const defaultItems: NavItem[] = [
  { label: "소개", href: "/info" },
  { label: "검사 과정", href: "/diagnosis/info" },
  { label: "FAQ", href: "/diagnosis/info#faq" },
];

const defaultItemHrefs: Record<string, string> = {
  "검사 과정": "/diagnosis/info",
  소개: "/info",
  FAQ: "/diagnosis/info#faq",
};

const normalizeItem = (item: NavItem) => (typeof item === "string" ? { label: item, href: defaultItemHrefs[item] ?? "/diagnosis/info" } : item);

export function LandingHeader({ brandHref = "/info", label = "메인 내비게이션", activeItem = "소개", items = defaultItems }: LandingHeaderProps) {
  const navItems = items.map(normalizeItem);
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, item: { label: string }) => {
    if (item.label !== "FAQ") return;

    event.preventDefault();
    window.alert("준비중입니다.");
  };

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 flex min-h-20 items-center justify-between border-b border-[rgba(242,218,218,0.42)] bg-[rgba(255,247,245,0.78)] px-8 backdrop-blur-[12px] transition-[min-height,padding,background-color] duration-200 max-lg:px-6"
      aria-label={label}
    >
      <Link className="flex min-w-0 max-w-[calc(100vw-5rem)] flex-col text-[#292524]" href={brandHref}>
        <strong className="text-body-m font-medium leading-[1.4] lg:whitespace-nowrap lg:text-h2 lg:leading-[1.625]">복음경제영성 종합 진단</strong>
        <span className="text-caption font-light leading-4 text-black lg:whitespace-nowrap lg:text-body-m">한국교회 목회지원센터</span>
      </Link>
      <div className="flex items-center gap-10 max-lg:hidden">
        {navItems.map((item) => {
          const isActive = item.label === activeItem;

          return (
            <Link
              className={isActive ? "border-b border-[#fecdd3] pb-[5px] text-base font-extrabold leading-6 !text-[#BE123C]" : "text-base font-semibold leading-6 text-[#78716c]"}
              href={item.href}
              key={item.label}
              onClick={(event) => handleNavClick(event, item)}
              style={isActive ? { color: "#BE123C" } : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <details className="relative hidden max-lg:block">
        <summary className="flex h-8 w-8 list-none flex-col items-center justify-center gap-[5px] p-1 [&::-webkit-details-marker]:hidden" aria-label="메뉴 열기">
          <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
          <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
          <span className="block h-0.5 w-6 rounded-full bg-[#615557]" />
        </summary>
        <div className="absolute right-0 top-[42px] grid w-40 gap-3 rounded-lg border border-[#f2dada] bg-[rgba(255,247,245,0.96)] p-4 shadow-[0_12px_28px_rgba(97,85,87,0.14)]">
          {navItems.map((item) => {
            const isActive = item.label === activeItem;

            return (
              <Link className={isActive ? "text-sm font-extrabold leading-5 !text-[#BE123C]" : "text-sm font-extrabold leading-5 text-[#615557]"} href={item.href} key={item.label} onClick={(event) => handleNavClick(event, item)} style={isActive ? { color: "#BE123C" } : undefined}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
