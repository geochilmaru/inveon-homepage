# 인비온 영어학원 (INVEON English Academy) 홈페이지 및 목업 시스템

본 프로젝트는 인지과학에 기반한 최상위 리딩·작문 중심의 송도 명문 영어학원인 **인비온 영어학원(IEA)**의 공식 홈페이지 시안 및 통합 관리 시스템입니다.

이 시스템은 클라이언트 측 `localStorage`와 백엔드 Express 서버, 그리고 클라우드 데이터베이스인 **Neon PostgreSQL**을 유기적으로 연동하여 강력한 내결함성(Resilience)을 갖춘 실시간 상담 신청 동기화 아키텍처를 제공합니다.

---

## 🚀 주요 특징

1. **5종 목업 시안 갤러리**:
   - **Premium**: 엘리트 다크 & 골드 에디토리얼 시안 (프리미엄 캘린더 예약 모듈 포함)
   - **Outcome**: 성과 분석 및 대시보드 위젯 시안 (10초 단어 퀴즈 게임 및 Before/After 이미지 드래그 슬라이더 포함)
   - **Parent-Focused**: 학부모용 스토리텔링 시안 (아코디언 FAQ 및 후기 슬라이더 포함)
   - **Apple Minimal**: 미니멀 & 본질 타이포그래피 시안 (Intersection Observer 텍스트 페이드 및 간편 콜백)
   - **Friendly**: 커뮤니티 및 활동 중심 시안 (가상 스탬프 숍 시뮬레이터 및 챗봇 예약 모듈 포함)

2. **실시간 상담 신청 동기화**:
   - 프론트엔드의 상담 신청 및 예약 현황 데이터는 사용자의 `localStorage`에 우선적으로 기록된 후 Express API(`/api/sync`)를 통해 서버로 즉시 전송됩니다.
   - 개인정보 수집 및 이용 동의 필수 체크 기능이 적용되어 법적 준수 사항을 준수합니다.

3. **Neon DB + Prisma ORM 연동**:
   - 백엔드는 **Neon PostgreSQL** 클라우드 DB와 **Prisma ORM**을 통해 실시간으로 예약을 저장하고 불러옵니다.
   - 단일 데이터 소스 장애 대비를 위해 **이중화 동기화(Dual-layer Fallback)** 아키텍처를 채택했습니다. 데이터베이스 연동 실패 시 로컬 파일 시스템(`data/reservations.json`)으로 백업 동작하여 중단 없는 서비스를 실현합니다.

---

## 🛠️ 기술 스택 및 환경 설정

* **Core**: Node.js, Express
* **Database**: Neon PostgreSQL
* **ORM**: Prisma ORM (v5.18.0대 호환)
* **Hosting / Deployment**: Vercel

### 로컬 환경 변수 (.env) 설정
루트 경로에 `.env` 파일을 생성하고 아래와 같이 Neon Connection String 주입이 필요합니다.
```env
DATABASE_URL="postgresql://neondb_owner:npg_EArSZ9odLhC5@ep-muddy-block-ao14hyjh.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 🏃 로컬 개발 및 실행 방법

1. **의존성 패키지 설치**:
   ```bash
   npm install
   ```

2. **Prisma Client 생성**:
   ```bash
   npx prisma generate
   ```

3. **원격 Neon DB 마이그레이션 적용** (필요시):
   ```bash
   npx prisma migrate dev --name init
   ```

4. **로컬 개발 서버 실행**:
   ```bash
   node server.js
   ```
   실행 후 브라우저에서 `http://localhost:3000`에 접속하여 테스트 및 갤러리를 사용하실 수 있습니다.
