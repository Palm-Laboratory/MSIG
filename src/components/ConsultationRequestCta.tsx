"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ConsultationRequestDialog } from "@/components/ConsultationRequestDialog";

type ConsultationRequestCtaProps = {
  children: ReactNode;
  className: string;
};

export function ConsultationRequestCta({ children, className }: ConsultationRequestCtaProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={className} onClick={() => setOpen(true)} type="button">
        {children}
      </button>
      <ConsultationRequestDialog onOpenChange={setOpen} open={open} />
    </>
  );
}
