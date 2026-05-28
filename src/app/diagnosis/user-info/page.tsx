"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RESULT_STORAGE_KEYS, writeJsonWithTtl, type UserProfile } from "@/lib/storage";

type FieldErrors = {
  name?: string;
  phone?: string;
  age?: string;
  gender?: string;
  privacyConsent?: string;
};

const validate = (name: string, phone: string, age: string, gender: string, church: string, privacyConsent: boolean): FieldErrors => {
  const errors: FieldErrors = {};
  if (name.trim().length < 2) errors.name = "이름을 2자 이상 입력해 주세요.";
  const trimmedPhone = phone.trim();
  const phoneDigits = trimmedPhone.replace(/\D/g, "");
  if (!trimmedPhone) errors.phone = "연락처를 입력해 주세요.";
  else if (!/^[0-9\s-]+$/.test(trimmedPhone) || phoneDigits.length < 9 || phoneDigits.length > 11) errors.phone = "연락처는 숫자 기준 9-11자리로 입력해 주세요.";
  const ageNum = Number(age);
  if (!age.trim()) errors.age = "나이를 입력해 주세요.";
  else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) errors.age = "올바른 나이를 입력해 주세요.";
  if (!gender) errors.gender = "성별을 선택해 주세요.";
  if (!privacyConsent) errors.privacyConsent = "개인정보 수집 및 이용에 동의해 주세요.";
  return errors;
};

export default function UserInfoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [church, setChurch] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fieldErrors = validate(name, phone, age, gender, church, privacyConsent);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const profile: UserProfile = { name: name.trim(), phone: phone.trim(), age: age.trim(), gender, church: church.trim() };
    writeJsonWithTtl(RESULT_STORAGE_KEYS.profile, profile);
    router.push("/diagnosis/part/1");
  };

  const inputClass =
    "min-h-12 w-full rounded border border-[#e8d0d0] bg-white px-4 text-body-m text-[#312225] outline-none transition placeholder:text-[#b69da2] focus:border-[#d47182] focus:ring-2 focus:ring-[#f3c6cf]";
  const labelClass = "grid gap-2 text-[#4f3f42]";
  const labelTextClass = "text-[0.875rem] font-extrabold";
  const errorClass = "text-[0.8125rem] font-semibold leading-5 text-[#9b4250]";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#fff7f5] px-6 py-12 text-[#292524]">
      <div className="pointer-events-none absolute -left-24 -top-24 size-[420px] rounded-full bg-[rgba(212,113,130,0.12)] blur-[60px]" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-6rem] size-[380px] rounded-full bg-[rgba(255,172,117,0.1)] blur-[60px]" />

      <section className="relative z-10 w-full max-w-[480px]">
        <div className="mb-8 text-center">
          <p className="mb-3 text-[0.625rem] font-extrabold uppercase tracking-[0.125rem] text-[#d47182]">PERSONAL INFORMATION</p>
          <h1 className="text-h2 lg:text-h2-desktop font-extrabold text-[#312225]">검사 전 기본 정보 입력</h1>
          <p className="mt-3 text-body-s font-medium text-[#8a5b63]">입력하신 정보는 연구 자료 수집 목적으로만 사용됩니다.</p>
        </div>

        <div className="rounded-xl border border-[#f1d7d7] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(212,113,130,0.1)] md:px-8">
          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <label className={labelClass} htmlFor="user-name">
              <span className={labelTextClass}>이름</span>
              <input
                autoComplete="name"
                className={inputClass}
                id="user-name"
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                placeholder="홍길동"
                type="text"
                value={name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "error-name" : undefined}
              />
              {errors.name && <span className={errorClass} id="error-name">{errors.name}</span>}
            </label>

            <label className={labelClass} htmlFor="user-phone">
              <span className={labelTextClass}>연락처</span>
              <input
                autoComplete="tel"
                className={inputClass}
                id="user-phone"
                inputMode="numeric"
                onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
                pattern="[0-9 -]*"
                placeholder="010-0000-0000"
                type="tel"
                value={phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "error-phone" : undefined}
              />
              {errors.phone && <span className={errorClass} id="error-phone">{errors.phone}</span>}
            </label>

            <label className={labelClass} htmlFor="user-age">
              <span className={labelTextClass}>나이</span>
              <input
                className={inputClass}
                id="user-age"
                inputMode="numeric"
                min={1}
                max={120}
                onChange={(e) => { setAge(e.target.value); setErrors((prev) => ({ ...prev, age: undefined })); }}
                placeholder="30"
                type="number"
                value={age}
                aria-invalid={Boolean(errors.age)}
                aria-describedby={errors.age ? "error-age" : undefined}
              />
              {errors.age && <span className={errorClass} id="error-age">{errors.age}</span>}
            </label>

            <fieldset className="grid gap-2">
              <legend className={labelTextClass + " text-[#4f3f42]"}>성별</legend>
              <div className="flex gap-4">
                {["남성", "여성"].map((option) => (
                  <label
                    key={option}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded border py-3 text-[0.9375rem] font-semibold transition ${
                      gender === option
                        ? "border-[#d47182] bg-[#fff0f2] text-[#d47182]"
                        : "border-[#e8d0d0] bg-white text-[#615557] hover:border-[#d47182]"
                    }`}
                  >
                    <input
                      checked={gender === option}
                      className="sr-only"
                      name="gender"
                      onChange={() => { setGender(option); setErrors((prev) => ({ ...prev, gender: undefined })); }}
                      type="radio"
                      value={option}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.gender && <span className={errorClass} id="error-gender">{errors.gender}</span>}
            </fieldset>

            <label className={labelClass} htmlFor="user-church">
              <span className={labelTextClass}>출석교회 <span className="text-[0.75rem] font-medium text-[#b69da2]">(선택)</span></span>
              <input
                className={inputClass}
                id="user-church"
                onChange={(e) => { setChurch(e.target.value); }}
                placeholder="출석하고 있는 교회가 있다면 입력해주세요"
                type="text"
                value={church}
              />
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-[#eedada] bg-[#fffafa] px-4 py-4 text-[#5f4c50]" htmlFor="privacy-consent">
              <input
                checked={privacyConsent}
                className="mt-0.5 size-4 accent-[#d47182]"
                id="privacy-consent"
                onChange={(e) => { setPrivacyConsent(e.target.checked); setErrors((prev) => ({ ...prev, privacyConsent: undefined })); }}
                type="checkbox"
              />
              <span className="grid gap-1 text-[0.8125rem] leading-5">
                <span className="font-extrabold">개인정보 수집 및 이용에 동의합니다.</span>
                <span className="text-[#8a7073]">입력하신 정보는 연구 자료 수집 목적으로만 사용되며, 제3자에게 제공되지 않습니다.</span>
                {errors.privacyConsent && <span className={errorClass}>{errors.privacyConsent}</span>}
              </span>
            </label>

            <button
              className="mt-1 inline-flex min-h-12 items-center justify-center rounded bg-[#d47182] px-5 text-[1rem] font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(146,75,87,0.22)] transition hover:-translate-y-0.5 hover:brightness-[1.03]"
              type="submit"
            >
              진단 시작하기
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
