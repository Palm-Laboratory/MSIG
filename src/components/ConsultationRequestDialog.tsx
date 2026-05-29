"use client";

import emailjs from "@emailjs/browser";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { formatEmailBodyFromStorage } from "@/lib/email";
import { readJsonWithTtl, RESULT_STORAGE_KEYS, type UserProfile } from "@/lib/storage";

type ConsultationRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getEmailJsErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return String(error);
  }

  const record = error as Record<string, unknown>;
  const details = {
    constructorName: error.constructor?.name,
    message: error instanceof Error ? error.message : record.message,
    status: record.status,
    text: record.text,
    type: record.type,
    keys: Object.getOwnPropertyNames(error),
    value: String(error),
  };

  try {
    return JSON.stringify(details);
  } catch {
    return String(error);
  }
};

export function ConsultationRequestDialog({ onOpenChange, open }: ConsultationRequestDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;

    const storedProfile = readJsonWithTtl<UserProfile | null>(RESULT_STORAGE_KEYS.profile, null, RESULT_STORAGE_KEYS.legacyProfile);
    setProfile(storedProfile);
    setSubmitError("");
    setStatus("idle");
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 0);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleEscape);
      openerRef.current?.focus();
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []).filter(
      (element) => element.offsetParent !== null && !element.hasAttribute("aria-hidden"),
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const handleConfirm = async () => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_CONSULTATION_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setSubmitError("신청을 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setStatus("submitting");
    setSubmitError("");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          user_name: profile?.name ?? "(미입력)",
          user_phone: profile?.phone ?? "-",
          privacy_consent: "동의",
          answers: formatEmailBodyFromStorage(profile ?? undefined),
        },
        { publicKey },
      );
      setStatus("success");
    } catch (error) {
      console.error(`[ConsultationRequestDialog] EmailJS request failed: ${getEmailJsErrorMessage(error)}`);
      setStatus("error");
      setSubmitError("신청을 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  return (
    <div
      aria-labelledby="consultation-request-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[rgba(31,26,27,0.54)] px-5 py-8 backdrop-blur-[5px]"
      onKeyDown={handleKeyDown}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
      role="dialog"
    >
      <div className="relative w-full max-w-[28rem] rounded-lg border border-[#f1d7d7] bg-[#fffafa] p-6 shadow-[0_24px_70px_rgba(61,43,43,0.24)] md:p-8" ref={dialogRef}>
        <button
          aria-label="상담 신청 닫기"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded border border-[#e4c9ce] bg-[#fff7f7] transition hover:border-[#d47182] hover:bg-[#fff0f2] focus:outline-none focus:ring-2 focus:ring-[#d47182] focus:ring-offset-2"
          onClick={() => onOpenChange(false)}
          type="button"
        >
          <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
            <path d="M5 5l10 10M15 5 5 15" stroke="#312225" strokeLinecap="round" strokeWidth="2.6" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <h2 className="text-[1.5rem] font-extrabold leading-[1.25] text-[#312225] md:text-[1.875rem]" id="consultation-request-title">
                신청 완료
              </h2>
              <p className="text-[0.9375rem] leading-6 text-[#5e4449]" aria-live="polite">
                참여해 주셔서 감사합니다. 곧 연락 드리겠습니다.
              </p>
            </div>
            <button className="inline-flex min-h-12 items-center justify-center rounded bg-[#d47182] px-5 text-[1rem] font-extrabold text-white transition hover:brightness-[1.03]" onClick={() => onOpenChange(false)} type="button">
              확인
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-2 pr-10">
              <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.12rem] text-[#d47182]">CONSULTATION</p>
              <h2 className="text-[1.5rem] font-extrabold leading-[1.25] text-[#312225] md:text-[1.875rem]" id="consultation-request-title">
                정밀 상담 신청
              </h2>
            </div>

            <div className="mt-4 grid gap-6">
              <p className="text-[0.9375rem] leading-6 text-[#5e4449]">상담 신청 확인 후 아래 연락 정보로 연락드리겠습니다.</p>

              <div className="grid gap-3 rounded-md border border-[#eedada] bg-white px-4 py-4 text-[0.9375rem]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-extrabold text-[#7d545b]">이름</span>
                  <span className="text-[#312225]">{profile?.name ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-extrabold text-[#7d545b]">연락처</span>
                  <span className="text-[#312225]">{profile?.phone ?? "-"}</span>
                </div>
              </div>

              {submitError ? (
                <p className="rounded-md border border-[#f1c5cc] bg-[#fff1f3] px-4 py-3 text-[0.875rem] font-semibold leading-6 text-[#9b4250]" aria-live="polite">
                  {submitError}
                </p>
              ) : null}

              <button
                className="inline-flex min-h-12 items-center justify-center rounded bg-[#d47182] px-5 text-[1rem] font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(146,75,87,0.22)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-65"
                disabled={isSubmitting}
                onClick={handleConfirm}
                ref={confirmButtonRef}
                type="button"
              >
                {isSubmitting ? "신청 중..." : "확인"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
