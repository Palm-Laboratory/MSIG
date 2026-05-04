export const RESULT_STORAGE_TTL_MS = 30 * 60 * 1000;

export const RESULT_STORAGE_KEYS = {
  answers: "ges_answers",
  profile: "ges_user",
  legacyAnswers: "msig.answers",
  legacyProfile: "msig.profile",
  partIndex: "ges_part_index",
} as const;

type StoredPayload<T> = {
  savedAt: number;
  value: T;
};

const isStoredPayload = <T>(value: unknown): value is StoredPayload<T> =>
  Boolean(value && typeof value === "object" && "savedAt" in value && "value" in value);

export const removeResultStorage = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(RESULT_STORAGE_KEYS.answers);
  window.localStorage.removeItem(RESULT_STORAGE_KEYS.profile);
  window.localStorage.removeItem(RESULT_STORAGE_KEYS.legacyAnswers);
  window.localStorage.removeItem(RESULT_STORAGE_KEYS.legacyProfile);
  window.localStorage.removeItem(RESULT_STORAGE_KEYS.partIndex);
};

export const readJsonWithTtl = <T>(key: string, fallback: T, legacyKey?: string, ttlMs = RESULT_STORAGE_TTL_MS): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const storedKey = window.localStorage.getItem(key) ? key : legacyKey;
    const stored = storedKey ? window.localStorage.getItem(storedKey) : null;
    if (!stored) return fallback;

    const parsed = JSON.parse(stored) as StoredPayload<T> | T;
    if (!isStoredPayload<T>(parsed)) {
      removeResultStorage();
      return fallback;
    }

    if (Date.now() - parsed.savedAt > ttlMs) {
      removeResultStorage();
      return fallback;
    }

    return parsed.value;
  } catch {
    return fallback;
  }
};

export const writeJsonWithTtl = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    key,
    JSON.stringify({
      savedAt: Date.now(),
      value,
    } satisfies StoredPayload<T>),
  );
};
