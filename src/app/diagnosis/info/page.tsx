"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Profile = {
  name: string;
  church: string;
};

const STORAGE_KEY = "ges_user";

const loadProfile = (): Profile => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Profile) : { name: "", church: "" };
  } catch {
    return { name: "", church: "" };
  }
};

export default function DiagnosisInfoPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ name: "", church: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const submit = () => {
    if (!profile.name.trim()) {
      setMessage("이름을 입력해 주세요.");
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: profile.name.trim(),
        church: profile.church.trim(),
      }),
    );
    router.push("/diagnosis/part/1");
  };

  return (
    <main className="survey-shell">
      <header className="survey-header">
        <Link className="brand-mark" href="/diagnosis">
          MSIG
        </Link>
      </header>

      <section className="survey-card profile-card" aria-label="기본 정보">
        <div>
          <p className="section-kicker">기본 정보</p>
          <h1>결과지에 표시할 정보를 입력해 주세요.</h1>
          <p>입력한 정보는 서버에 저장되지 않고 이 브라우저의 localStorage에만 임시 저장됩니다.</p>
        </div>
        <label>
          이름
          <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="홍길동" />
        </label>
        <label>
          출석 교회
          <input value={profile.church} onChange={(event) => setProfile({ ...profile, church: event.target.value })} placeholder="선택 입력" />
        </label>
        <div>
          {message ? <p className="form-message">{message}</p> : null}
          <button className="button primary" onClick={submit} type="button">
            진단 시작하기
          </button>
        </div>
      </section>
    </main>
  );
}
