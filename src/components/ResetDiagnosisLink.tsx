"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { removeResultStorage } from "@/lib/storage";

type ResetDiagnosisLinkProps = {
  children: ReactNode;
  className: string;
  href: string;
};

export function ResetDiagnosisLink({ children, className, href }: ResetDiagnosisLinkProps) {
  return (
    <Link className={className} href={href} onClick={removeResultStorage}>
      {children}
    </Link>
  );
}
