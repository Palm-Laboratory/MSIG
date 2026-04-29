# MSIG 복음경제영성 진단

복음경제영성 종합 진단 웹앱입니다. Next.js App Router 기반으로 랜딩, 진단 소개, 설문, 분석 로딩, 결과 페이지를 구성합니다.

## Tech Stack

- Next.js `15.5.12`
- React `19.0.0`
- TypeScript `5.7.2`
- Tailwind CSS v4
- Vitest

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run test
```

개발 서버 기본 포트는 `3000`입니다. 포트 충돌 시 Next.js가 다음 포트를 사용할 수 있습니다.

## Project Structure

```text
src/
  app/
    page.tsx                    # / 메인 랜딩
    diagnosis/page.tsx           # /diagnosis, 진단 소개로 redirect
    diagnosis/info/page.tsx      # /diagnosis/info, 진단 소개/검사 과정 랜딩
    diagnosis/part/[part]/page.tsx
    diagnosis/loading/page.tsx
    diagnosis/result/page.tsx
    about/page.tsx
    globals.css                  # Tailwind v4 import, @theme, font-face, global CSS
    layout.tsx
  components/
    landing-header.tsx           # 공통 상단 헤더
    landing-process-card.tsx     # 진단 과정 탭 카드
    site-footer.tsx              # 메인 푸터
    SurveyRunner.tsx             # 설문 진행 UI
    ResultView.tsx               # 결과 UI
  lib/
    design-tokens.ts             # TS에서 참조하는 디자인 토큰
    scoring.ts                   # 진단 점수 계산
    scoring.test.ts
    survey-data.ts               # 설문 데이터
docs/
  design-tokens.md               # 디자인 토큰 정책 문서
public/
  fonts/
    GmarketSansTTFLight.ttf
    GmarketSansTTFMedium.ttf
    GmarketSansTTFBold.ttf
```

## Routes

| URL | Role |
| --- | --- |
| `/` | 메인 랜딩. 현재 헤더와 섹션 배경 중심으로 구성 |
| `/diagnosis` | `/diagnosis/info`로 redirect |
| `/diagnosis/info` | 진단 소개. Figma 기준 섹션 작업 진행 중 |
| `/diagnosis/part/1` | Part 1 설문 |
| `/diagnosis/part/2` | Part 2 설문 |
| `/diagnosis/part/3` | Part 3 설문 |
| `/diagnosis/loading` | 분석 화면. 3초 후 결과로 이동 |
| `/diagnosis/result` | 결과 페이지 |
| `/about` | 선택 소개 페이지 |

## Design System

디자인 토큰의 기준 문서는 [docs/design-tokens.md](./docs/design-tokens.md)입니다.

실제 구현 기준은 두 곳입니다.

- [src/app/globals.css](./src/app/globals.css): Tailwind v4 `@theme`, `@font-face`, 전역 CSS
- [src/lib/design-tokens.ts](./src/lib/design-tokens.ts): 차트, 계산 기반 스타일 등 TS 영역에서 쓰는 토큰

신규 UI는 Tailwind 유틸리티와 `@theme` 토큰을 우선 사용합니다. CSS 파일은 복잡한 SVG 탭, 레거시 섹션, 전역 reset처럼 컴포넌트 클래스만으로 유지하기 어려운 경우에 제한적으로 사용합니다.

## Typography

서비스 기본 폰트는 Gmarket Sans입니다. 폰트 파일은 `public/fonts`에 둡니다.

| File | Weight |
| --- | --- |
| `GmarketSansTTFLight.ttf` | `300` |
| `GmarketSansTTFMedium.ttf` | `400`, `500` |
| `GmarketSansTTFBold.ttf` | `600`, `700`, `800` |

타입 스케일은 `rem` 기준입니다. 모바일 토큰을 기본으로 쓰고 데스크톱에서는 `md:` prefix로 desktop 토큰을 적용합니다.

| Role | Mobile | Desktop |
| --- | --- | --- |
| Display | `text-display` | `md:text-display-desktop` |
| H1 | `text-h1` | `md:text-h1-desktop` |
| H2 | `text-h2` | `md:text-h2-desktop` |
| H3 | `text-h3` | `md:text-h3-desktop` |
| H4 | `text-h4` | `md:text-h4-desktop` |
| Body-L | `text-body-l` | `md:text-body-l-desktop` |
| Body-M | `text-body-m` | `md:text-body-m-desktop` |
| Body-S | `text-body-s` | `md:text-body-s` |
| Label | `text-label` | `md:text-label` |
| Caption | `text-caption` | `md:text-caption` |

예시:

```tsx
<h1 className="text-display md:text-display-desktop">나의 경제 습관</h1>
<p className="text-body-m md:text-body-l-desktop">본문 문장</p>
```

새 타이포 작업에서 `text-[60px]`, `leading-[78px]` 같은 px 기반 임의값은 피합니다. Figma 수치가 px로 제공되더라도 타입 스케일 토큰에 매핑하거나 rem으로 환산해 사용합니다.

## Responsive Policy

이 프로젝트는 모바일 기본값을 먼저 작성하고, 화면이 넓어질 때 `md:` 또는 필요한 breakpoint로 확장합니다.

권장 패턴:

```tsx
<h1 className="text-display md:text-display-desktop">...</h1>
<section className="px-6 md:px-[60px]">...</section>
```

피해야 할 패턴:

```tsx
<h1 className="text-display-desktop max-[900px]:text-display">...</h1>
```

반응형 점검 기준:

- 텍스트는 모바일 기본 토큰을 먼저 쓰고 데스크톱 토큰은 `md:`로 올립니다.
- `whitespace-nowrap`는 모바일에서 금지에 가깝게 봅니다. 꼭 필요하면 `md:whitespace-nowrap`처럼 넓은 화면에서만 적용합니다.
- 큰 고정 width/height는 모바일에서 `w-full`, `max-w-*`, `aspect-*`로 풀어줍니다.
- 섹션 높이는 `min-h`를 사용하고, 뷰포트 기준 섹션은 `min-h-[100svh]`를 조건부로 적용합니다.
- Figma 데스크톱 프레임 수치를 그대로 모바일 기본값으로 가져오지 않습니다.

## Current UI Notes

- `/diagnosis/info` 섹션1은 Figma node `260:2054` 기준으로 작업 중입니다.
- CTA 버튼은 배경 `#d47182`, 텍스트와 화살표는 흰색입니다.
- `landing-header.tsx`는 공통 헤더이며 `activeItem`, `items`, `brandHref`, `label` props를 받습니다.
- `landing-process-card.tsx`는 SVG 탭 형태 때문에 일부 스타일을 `globals.css`의 `.process-*` 클래스에 둡니다.
- 메인 랜딩 `/`은 기존 컨텐츠를 줄이고 헤더와 섹션별 배경 중심으로 재구성 중입니다.

## Figma Workflow

Figma 디자인 구현 요청은 URL의 `node-id`를 기준으로 작업합니다.

1. Figma MCP로 디자인 컨텍스트와 스크린샷을 확인합니다.
2. 기존 컴포넌트와 토큰에 맞춰 구현합니다.
3. 가능한 경우 Tailwind 토큰을 우선 사용합니다.
4. 구현 후 `npm run typecheck`와 `npm run build`로 확인합니다.

## Validation Policy

작업 후 기본 검증은 다음 순서로 진행합니다.

```bash
npm run typecheck
npm run build
```

점수 계산이나 설문 로직을 건드렸다면 추가로 실행합니다.

```bash
npm run test
```

## Implementation Preferences

- 새 UI는 Tailwind 중심으로 작성합니다.
- 타이포는 `rem` 기반 타입 토큰을 사용합니다.
- 공통 요소는 `src/components`로 분리합니다.
- 라우팅은 Next.js App Router 규칙을 따릅니다.
- 사용자 플로우는 `/diagnosis/info`에서 시작해 `/diagnosis/part/1`로 진입합니다.
- 기존 사용자 변경사항을 임의로 되돌리지 않습니다.
