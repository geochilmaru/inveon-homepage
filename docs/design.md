---
version: alpha
name: Inveon
colors:
  primary: "#1E3A8A"
  skyblue: "#60A5FA"
  accent: "#F59E0B"
  accent-dark: "#D97706"
  text-primary: "#111827"
  text-secondary: "#4B5563"
  text-light: "#9CA3AF"
  bg-light: "#F9FAFB"
  bg-white: "#FFFFFF"
  border: "#E5E7EB"
typography:
  h1:
    fontFamily: Pretendard, Outfit
    fontSize: 2.5rem
    fontWeight: 700
  h2:
    fontFamily: Pretendard, Outfit
    fontSize: 2rem
    fontWeight: 700
  h3:
    fontFamily: Pretendard, Outfit
    fontSize: 1.375rem
    fontWeight: 700
  body-lg:
    fontFamily: Pretendard, Outfit
    fontSize: 1.125rem
    fontWeight: 500
  body-rg:
    fontFamily: Pretendard, Outfit
    fontSize: 1rem
    fontWeight: 400
  caption:
    fontFamily: Pretendard, Outfit
    fontSize: 0.875rem
    fontWeight: 400
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 64px
  section: 84px
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
---

## Overview
인비온영어학원(IEA)의 공식 웹디자인 시스템은 신뢰성(Trustworthy), 명확성(Clarity), 그리고 주도적인 소통 환경의 에너지를 균형 있게 표현합니다.
학문적이고 지적인 전문성을 드러내기 위해 정적인 다크 네이비와 밝고 기민한 스카이 블루 및 액센트 오렌지를 교차하여 사용합니다.

## Colors
인비온의 색상 체계는 세련된 아카데믹 무드와 학부모/학생 양측의 시각적 안정감을 위해 설계되었습니다.
* **주색상 (Deep Navy - {colors.primary}):** 주요 타이틀, 네비게이션 헤더 및 중요 컴포넌트의 배경으로 사용하여 전문성과 명문 교육 기관으로서의 신뢰감을 나타냅니다.
* **보조색상 (Sky Blue - {colors.skyblue}):** 디지털 도서관, 에코시스템 카드 등 청량하고 주도적인 학생 활동 영역에 활용합니다.
* **강조색상 (Accent Orange - {colors.accent}):** 예약 신청 단추(CTA), 스탬프 뱃지 등 즉각적인 행동 유도가 필요한 곳에 사용하여 동기를 부여합니다.

## Typography
디바이스 가독성과 가독 시간 극대화를 최우선으로 합니다.
* **기본 서체**: `Pretendard` 국문 폰트와 `Outfit` 영문 폰트를 혼용하여 가독성을 높입니다.
* **기본 자간 및 행간**: 본문 전체 자간은 `-0.02em`, 행간은 `1.65`배로 통일하여 줄 바꿈 시 스캐너빌리티를 확보합니다.
* **H1 ({typography.h1.fontSize})**: 히어로 배너 슬로건 영역에 적용합니다.
* **H2 ({typography.h2.fontSize})**: 각 섹션의 대주제 타이틀에 적용합니다.
* **H3 ({typography.h3.fontSize})**: 그리드 카드 제목 및 서브 박스 타이틀에 적용합니다.

## Layout
* **최대 레이아웃 너비**: 데스크톱 기준 1140px (`container`)
* **브레이크포인트**:
  - Desktop: 1200px 이상
  - Tablet: 768px ~ 1199px (컨테이너 여백 24px)
  - Mobile: 767px 이하 (컨테이너 여백 16px, 모바일용 세로 1열 정렬 적용)
* **간격 시스템**: 8px 배수 기반의 패딩 및 마진 설계 적용. 섹션 간 간격은 최소 `{spacing.section}`을 유지합니다.

## Elevation & Depth
* **Sm Shadow**: 기본 입력 폼 요소 및 얇은 경계용
* **Md Shadow**: 리스트 카드 및 일반 구조체용 (`0px 4px 6px rgba(0, 0, 0, 0.05)`)
* **Lg Shadow / Premium Shadow**: 플로팅 위젯, 예약 폼 배경 등 깊이 있는 레이어 분리에 사용

## Shapes
기본 테두리 둥글기 값은 모서리의 둥근 리프팅 효과와 부드러운 인상을 주기 위해 다목적으로 나뉩니다.
* **Small ({rounded.sm})**: 소형 뱃지 및 인풋박스 체크박스용
* **Medium ({rounded.md})**: CTA 버튼용 테두리 반경
* **Large ({rounded.lg})**: 설명 카드 및 그리드 박스용 모서리 반경
* **Extra Large ({rounded.xl})**: 대형 섹션 카드 및 예약 폼 컴포넌트용 반경

## Components
* **CTA Button (Primary)**: 배경 `{colors.accent}`, 글자 흰색, 모서리 `{rounded.md}`. Hover 시 `{colors.accent-dark}`로 10% 어두워지며 1.03배 스케일 업 애니메이션을 제공합니다.
* **Secondary Button**: 투명 배경 혹은 흰색 배경, 테두리 `1px solid {colors.primary}`, 글자색 `{colors.primary}`.
* **Info Card**: 배경 `{colors.bg-white}`, 테두리 `{colors.border}`, 모서리 `{colors.lg}`, 호버 시 Y축으로 `-6px` 부드럽게 리프팅되며 그림자가 강화됩니다.

## Do's and Don'ts
* **Do**: 모든 글자 타이포그래피는 Pretendard 또는 Outfit 서체를 선언하고 일관성 있게 자간 `-0.02em`을 적용하세요.
* **Do**: 예약 버튼(CTA)은 눈에 잘 띄도록 주황색({colors.accent})을 고수하고 적절한 호버 트랜지션을 연결하세요.
* **Don't**: 주요 텍스트 색상으로 순수 검은색(`#000`)을 사용하지 말고, 다크 그레이({colors.text-primary})를 사용하여 피로도를 줄이세요.
* **Don't**: Deep Navy({colors.primary}) 배경 위에 어두운 텍스트를 배치하여 가독성 대비 오류를 유발하지 마세요.
