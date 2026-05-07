"use client";

import emailjs from "@emailjs/browser";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { readJsonWithTtl, RESULT_STORAGE_KEYS } from "@/lib/storage";
import { SURVEY_PARTS, SURVEY_QUESTIONS } from "@/lib/survey-data";

type ConsultationRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FieldErrors = {
  userName?: string;
  userPhone?: string;
  privacyConsent?: string;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const validateForm = (userName: string, userPhone: string, privacyConsent: boolean): FieldErrors => {
  const errors: FieldErrors = {};
  const trimmedName = userName.trim();
  const trimmedPhone = userPhone.trim();
  const phoneDigits = trimmedPhone.replace(/\D/g, "");

  if (trimmedName.length < 2) {
    errors.userName = "이름을 2자 이상 입력해 주세요.";
  }

  if (!trimmedPhone) {
    errors.userPhone = "전화번호를 입력해 주세요.";
  } else if (!/^[0-9\s-]+$/.test(trimmedPhone) || phoneDigits.length < 9 || phoneDigits.length > 11) {
    errors.userPhone = "전화번호는 숫자 기준 9-11자리로 입력해 주세요.";
  }

  if (!privacyConsent) {
    errors.privacyConsent = "개인정보 수집 및 이용 동의가 필요합니다.";
  }

  return errors;
};

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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatSurveyAnswersTableForEmail = () => {
  const answers = readJsonWithTtl<Record<string, number>>(RESULT_STORAGE_KEYS.answers, {}, RESULT_STORAGE_KEYS.legacyAnswers);
  const scoreColumns = [1, 2, 3, 4, 5];
  const rows = SURVEY_PARTS.flatMap((part) => {
    const partQuestions = SURVEY_QUESTIONS.filter((question) => question.part === part.id);
    const partHeader = `<tr><td colspan="7" style="background:#f7e8ea;color:#312225;font-weight:700;padding:10px 8px">${escapeHtml(part.title)} (${part.questionRange[0]}-${part.questionRange[1]}번, ${part.questionCount}문항)</td></tr>`;
    const questionRows = partQuestions.map((question) => {
      const answer = answers[String(question.id)];

      return `<tr><td align="center" width="38">${question.id}</td><td>${escapeHtml(question.label)}</td>${scoreColumns.map((score) => `<td align="center" width="38"${answer === score ? ' style="color:#d92d20;font-weight:700;font-size:15px"' : ""}>${answer === score ? "✓" : score}</td>`).join("")}</tr>`;
    });

    return [partHeader, ...questionRows];
  }).join("");

  return `<table border="1" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,'Malgun Gothic',sans-serif;font-size:13px;line-height:1.45"><tbody>${rows}</tbody></table>`;
};

export function ConsultationRequestDialog({ onOpenChange, open }: ConsultationRequestDialogProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const consentInputRef = useRef<HTMLInputElement | null>(null);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;

    setUserName("");
    setUserPhone("");
    setPrivacyConsent(false);
    setErrors({});
    setSubmitError("");
    setStatus("idle");
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      nameInputRef.current?.focus();
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

  const focusFirstInvalidField = (fieldErrors: FieldErrors) => {
    if (fieldErrors.userName) {
      nameInputRef.current?.focus();
      return;
    }

    if (fieldErrors.userPhone) {
      phoneInputRef.current?.focus();
      return;
    }

    if (fieldErrors.privacyConsent) {
      consentInputRef.current?.focus();
    }
  };

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fieldErrors = validateForm(userName, userPhone, privacyConsent);
    setErrors(fieldErrors);
    setSubmitError("");

    if (Object.keys(fieldErrors).length > 0) {
      focusFirstInvalidField(fieldErrors);
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("[ConsultationRequestDialog] Missing EmailJS configuration.", {
        hasPublicKey: Boolean(publicKey),
        hasServiceId: Boolean(serviceId),
        hasTemplateId: Boolean(templateId),
      });
      setStatus("error");
      setSubmitError("신청을 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (!formRef.current) return;

    setStatus("submitting");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          user_name: userName.trim(),
          user_phone: userPhone.trim(),
          privacy_consent: privacyConsent ? "동의" : "미동의",
          answers: formatSurveyAnswersTableForEmail(),
        },
        { publicKey },
      );
      setStatus("success");
      setUserName("");
      setUserPhone("");
      setPrivacyConsent(false);
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

        <div className="grid gap-2 pr-10">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.12rem] text-[#d47182]">CONSULTATION</p>
          <h2 className="text-[1.5rem] font-extrabold leading-[1.25] text-[#312225] md:text-[1.875rem]" id="consultation-request-title">
            정밀 상담 신청
          </h2>
          <p className="text-[0.875rem] leading-6 text-[#756669]">이름과 연락처를 남겨주시면 상담 신청 확인 후 연락드리겠습니다.</p>
        </div>

        {isSuccess ? (
          <div className="mt-8 grid gap-6">
            <p className="rounded-md border border-[#f1d7d7] bg-white px-4 py-4 text-[0.9375rem] font-semibold leading-6 text-[#5e4449]" aria-live="polite">
              신청이 완료되었습니다. 곧 연락드리겠습니다.
            </p>
            <button className="inline-flex min-h-12 items-center justify-center rounded bg-[#d47182] px-5 text-[1rem] font-extrabold text-white transition hover:brightness-[1.03]" onClick={() => onOpenChange(false)} type="button">
              확인
            </button>
          </div>
        ) : (
          <form className="mt-8 grid gap-5" onSubmit={handleSubmit} ref={formRef}>
            {submitError ? (
              <p className="rounded-md border border-[#f1c5cc] bg-[#fff1f3] px-4 py-3 text-[0.875rem] font-semibold leading-6 text-[#9b4250]" aria-live="polite">
                {submitError}
              </p>
            ) : null}

            <label className="grid gap-2 text-[#4f3f42]" htmlFor="consultation-user-name">
              <span className="text-[0.875rem] font-extrabold">이름</span>
              <input
                aria-describedby={errors.userName ? "consultation-user-name-error" : undefined}
                aria-invalid={Boolean(errors.userName)}
                autoComplete="name"
                className="min-h-12 rounded border border-[#e8d0d0] bg-white px-4 text-[1rem] text-[#312225] outline-none transition placeholder:text-[#b69da2] focus:border-[#d47182] focus:ring-2 focus:ring-[#f3c6cf]"
                id="consultation-user-name"
                name="user_name"
                onChange={(event) => {
                  setUserName(event.target.value);
                  setErrors((current) => ({ ...current, userName: undefined }));
                }}
                placeholder="이름"
                ref={nameInputRef}
                type="text"
                value={userName}
              />
              {errors.userName ? (
                <span className="text-[0.8125rem] font-semibold leading-5 text-[#9b4250]" id="consultation-user-name-error">
                  {errors.userName}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-[#4f3f42]" htmlFor="consultation-user-phone">
              <span className="text-[0.875rem] font-extrabold">전화번호</span>
              <input
                aria-describedby={errors.userPhone ? "consultation-user-phone-error" : undefined}
                aria-invalid={Boolean(errors.userPhone)}
                autoComplete="tel"
                className="min-h-12 rounded border border-[#e8d0d0] bg-white px-4 text-[1rem] text-[#312225] outline-none transition placeholder:text-[#b69da2] focus:border-[#d47182] focus:ring-2 focus:ring-[#f3c6cf]"
                id="consultation-user-phone"
                inputMode="numeric"
                name="user_phone"
                onChange={(event) => {
                  setUserPhone(event.target.value);
                  setErrors((current) => ({ ...current, userPhone: undefined }));
                }}
                pattern="[0-9 -]*"
                placeholder="010-0000-0000"
                ref={phoneInputRef}
                type="tel"
                value={userPhone}
              />
              {errors.userPhone ? (
                <span className="text-[0.8125rem] font-semibold leading-5 text-[#9b4250]" id="consultation-user-phone-error">
                  {errors.userPhone}
                </span>
              ) : null}
            </label>

            <label className="flex items-start gap-3 rounded-md border border-[#eedada] bg-white px-4 py-4 text-[#5f4c50]" htmlFor="consultation-privacy-consent">
              <input
                aria-describedby={errors.privacyConsent ? "consultation-privacy-consent-error" : "consultation-privacy-description"}
                aria-invalid={Boolean(errors.privacyConsent)}
                checked={privacyConsent}
                className="mt-1 size-4 accent-[#d47182]"
                id="consultation-privacy-consent"
                name="privacy_consent"
                onChange={(event) => {
                  setPrivacyConsent(event.target.checked);
                  setErrors((current) => ({ ...current, privacyConsent: undefined }));
                }}
                ref={consentInputRef}
                type="checkbox"
                value="동의"
              />
              <span className="grid gap-1 text-[0.8125rem] leading-5">
                <span className="font-extrabold">개인정보 수집 및 이용에 동의합니다.</span>
                <span id="consultation-privacy-description">입력하신 이름과 전화번호는 상담 신청 확인 및 연락 목적으로만 사용됩니다.</span>
                {errors.privacyConsent ? (
                  <span className="font-semibold text-[#9b4250]" id="consultation-privacy-consent-error">
                    {errors.privacyConsent}
                  </span>
                ) : null}
              </span>
            </label>

            <button
              className="inline-flex min-h-12 items-center justify-center rounded bg-[#d47182] px-5 text-[1rem] font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(146,75,87,0.22)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-65"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "신청 중..." : "신청하기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
