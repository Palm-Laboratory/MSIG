export const designTokens = {
  color: {
    bg: {
      base: "#FFF5F5",
      soft: "#FFF7F5",
    },
    surface: {
      default: "#FFFEFE",
      raised: "rgba(255, 255, 255, 0.86)",
      tinted: "#FAE8EB",
    },
    primary: {
      default: "#E8667A",
      hover: "#C94F63",
      muted: "#FFE2DB",
      subtle: "#F9E4E7",
    },
    section: {
      dark: "#3D2B2B",
      darkSoft: "#52494B",
    },
    text: {
      primary: "#2D1A1A",
      strong: "#1C1C19",
      secondary: "#8B6B6B",
      muted: "#78716C",
      inverse: "#FFF7F5",
    },
    border: {
      default: "#EFDFDF",
      strong: "#CFBEBE",
    },
    state: {
      success: "#4CAF82",
      warning: "#F59E0B",
      danger: "#EF4444",
      focus: "#BE123C",
    },
  },
  font: {
    sans: '"Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif',
  },
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    pill: "999px",
  },
  shadow: {
    soft: "0 14px 38px rgba(140, 71, 82, 0.09)",
    card: "0 18px 50px rgba(140, 71, 82, 0.14)",
    overlay: "0 18px 45px rgba(30, 22, 24, 0.18)",
  },
  motion: {
    duration: {
      fast: "160ms",
      base: "220ms",
      slow: "520ms",
    },
    easing: {
      standard: "ease",
    },
  },
  layout: {
    contentMax: "1280px",
  },
} as const;

export type DesignTokens = typeof designTokens;
