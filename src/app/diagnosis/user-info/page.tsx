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

const validate = (name: string, phone: string, age: string, gender: string, privacyConsent: boolean): FieldErrors => {
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

const inputClass =
  "min-h-12 w-full rounded border border-[#d6c2c3] bg-white px-4 text-[1rem] text-[#292524] outline-none transition placeholder:text-[14px] placeholder:text-[#c4a9ad] focus:border-[#d47182] focus:ring-2 focus:ring-[rgba(212,113,130,0.15)]";

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
    const fieldErrors = validate(name, phone, age, gender, privacyConsent);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const profile: UserProfile = { name: name.trim(), phone: phone.trim(), age: age.trim(), gender, church: church.trim() };
    writeJsonWithTtl(RESULT_STORAGE_KEYS.profile, profile);
    router.push("/diagnosis/part/1");
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#fff7f5] px-6 py-12 text-[#292524]">
      <div className="pointer-events-none absolute -left-24 -top-24 size-[420px] rounded-full bg-[rgba(212,113,130,0.12)] blur-[60px]" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-6rem] size-[380px] rounded-full bg-[rgba(255,172,117,0.1)] blur-[60px]" />

      <section className="relative z-10 flex w-full max-w-[480px] flex-col gap-[3.75rem]">
        <div className="flex flex-col items-center gap-[12px] text-center">
          <p className="text-[0.625rem] font-bold uppercase leading-none tracking-[0.075rem] text-[#c18590]">PERSONAL INFORMATION</p>
          <h1 className="text-[28px] font-bold leading-[1.22] text-[#292524] md:text-[36px]">검사 전 개인정보 입력</h1>
          <p className="text-[15px] font-medium leading-4 tracking-[0.3px] text-[#78716c]">
            입력하신 정보는 연구 자료 수집 목적으로만 사용됩니다.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(0,0,0,0.04)] bg-[#fffdfd] px-6 py-8 shadow-[0_4px_8px_rgba(0,0,0,0.1)] md:px-8">
          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>

            {/* 이름 */}
            <label className="grid gap-2" htmlFor="user-name">
              <span className="text-[0.8125rem] font-normal text-[#524345]">이름</span>
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
              {errors.name && (
                <span className="text-[0.8125rem] font-medium leading-5 text-[#a33d4c]" id="error-name">{errors.name}</span>
              )}
            </label>

            {/* 연락처 */}
            <label className="grid gap-2" htmlFor="user-phone">
              <span className="text-[0.8125rem] font-normal text-[#524345]">연락처</span>
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
              {errors.phone && (
                <span className="text-[0.8125rem] font-medium leading-5 text-[#a33d4c]" id="error-phone">{errors.phone}</span>
              )}
            </label>

            {/* 나이 */}
            <label className="grid gap-2" htmlFor="user-age">
              <span className="text-[0.8125rem] font-normal text-[#524345]">나이</span>
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
              {errors.age && (
                <span className="text-[0.8125rem] font-medium leading-5 text-[#a33d4c]" id="error-age">{errors.age}</span>
              )}
            </label>

            {/* 성별 */}
            <fieldset className="grid">
              <legend className="text-[0.8125rem] font-normal text-[#524345]">성별</legend>
              <div className="mt-[8px] flex gap-3">
                {["남성", "여성"].map((option) => (
                  <label
                    key={option}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded border py-3 text-[0.9375rem] font-medium transition ${
                      gender === option
                        ? "border-[#d47182] bg-[linear-gradient(143deg,#ffebeb_30%,#fff5f5_67%)] text-[#a33d4c]"
                        : "border-[#d6c2c3] bg-white text-[#78716c] hover:border-[#d47182]"
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
                    <span
                      className={
                        gender === option
                          ? "grid size-4 place-items-center rounded-full border-[0.1875rem] border-[rgba(255,169,173,0.4)] bg-[#f27c7c]"
                          : "size-4 rounded-full border border-[#d6c2c3]"
                      }
                    >
                      {gender === option && (
                        <svg aria-hidden="true" className="size-2" fill="none" viewBox="0 0 8 8">
                          <path d="M1.25 4.15 3.1 6 6.75 2" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                        </svg>
                      )}
                    </span>
                    {option}
                  </label>
                ))}
              </div>
              {errors.gender && (
                <span className="text-[0.8125rem] font-medium leading-5 text-[#a33d4c]">{errors.gender}</span>
              )}
            </fieldset>

            {/* 출석교회 (선택) */}
            <label className="grid gap-2" htmlFor="user-church">
              <span className="text-[0.8125rem] font-normal text-[#524345]">
                출석교회{" "}
                <span className="text-[0.75rem] font-medium text-[#a8a29e]">(선택)</span>
              </span>
              <input
                className={inputClass}
                id="user-church"
                onChange={(e) => { setChurch(e.target.value); }}
                placeholder="출석하고 있는 교회가 있다면 입력해주세요"
                type="text"
                value={church}
              />
            </label>

            {/* 개인정보 동의 */}
            <label
              className="relative flex cursor-pointer items-start gap-3 overflow-hidden rounded border border-[rgba(0,0,0,0.04)] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              htmlFor="privacy-consent"
            >
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-[rgba(140,71,82,0.05)] blur-[2rem]" />
              <input
                checked={privacyConsent}
                className="mt-0.5 size-4 accent-[#d47182]"
                id="privacy-consent"
                onChange={(e) => { setPrivacyConsent(e.target.checked); setErrors((prev) => ({ ...prev, privacyConsent: undefined })); }}
                type="checkbox"
              />
              <span className="grid gap-1 text-[0.8125rem] leading-5">
                <span className="font-normal text-[#524345]">개인정보 수집 및 이용에 동의합니다.</span>
                <span className="text-[#a8a29e]">입력하신 정보는 연구 자료 수집 목적으로만 사용되며, 제3자에게 제공되지 않습니다.</span>
                {errors.privacyConsent && (
                  <span className="font-medium text-[#a33d4c]">{errors.privacyConsent}</span>
                )}
              </span>
            </label>

            <button
              className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded bg-[linear-gradient(156deg,#d47182_30.73%,#e68798_67%)] px-5 text-[1rem] font-medium text-white shadow-[0_10px_15px_-3px_rgba(140,71,82,0.2),0_4px_6px_-4px_rgba(140,71,82,0.2)] transition hover:-translate-y-0.5"
              type="submit"
            >
              <span>진단 시작하기</span>
              <svg aria-hidden="true" className="h-[0.8125rem] w-[0.875rem]" fill="none" viewBox="0 0 14 13">
                <path d="m5.4 2.1 4.4 4.4-4.4 4.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
