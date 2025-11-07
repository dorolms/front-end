# DORO LMS – Frontend (Next.js)

강사–매니저 강의 일정 관리용 웹앱 프론트엔드 레포입니다.

## ✨ Tech Stack

- **Next.js 14 (App Router)**, **React 18**, **TypeScript**
- **Tailwind CSS**
- Package: npm

## 📦 Requirements

- Node.js ≥ 18.x
- npm ≥ 9.x
- Git

## 🚀 시작하기 (Getting Started)

### 1) 패키지 설치

```bash
npm install
```

### 2) 개발 서버 실행

```bash
npm run dev
```

- 브라우저에서 👉 [http://localhost:3000](http://localhost:3000) 열기

---

## 🗂 폴더 구조 (Project Structure)

```
front-end/
├─ public/                        # 정적 리소스 (이미지, 아이콘 등)
├─ src/
│  ├─ app/                        # 주요 페이지 폴더 (Next.js App Router)
│  │  ├─ auth/                   # 로그인/회원가입 관련 페이지
│  │  ├─ instructor/             # 강사용 페이지 모음
│  │  │  ├─ calendar/            # 강사 - 나의 강의 캘린더
│  │  │  ├─ dashboard/           # 강사 - 대시보드
│  │  │  ├─ lectures/            # 강사 - 강의 신청 목록/캘린더
│  │  │  ├─ messages/            # 강사 - 메세지
│  │  │  ├─ notices/             # 강사 - 공지사항
│  │  │  └─ layout.tsx           # 강사 전용 레이아웃
│  │  ├─ manager/                # 매니저용 페이지 모음
│  │  │  ├─ dashboard/           # 매니저 - 대시보드
│  │  │  ├─ instructors/         # 매니저 - 강사 관리
│  │  │  ├─ lectures/            # 매니저 강의용 페이지 모음
│  │  │  │  ├─ [id]/             # 매니저 - 특정 강의 상세
│  │  │  │  ├─ new/              # 매니저 - 신규 강의 등록
│  │  │  │  └─ page.tsx          # 매니저 - 전체 강의 리스트
│  │  │  ├─ messages/            # 매니저 - 메세지
│  │  │  ├─ notices/             # 매니저 - 공지사항
│  │  │  └─ layout.tsx           # 매니저 전용 레이아웃
│  │  ├─ layout.tsx              # 공통 레이아웃
│  │  └─ page.tsx                # 메인 페이지
│  ├─ components/                # 재사용 컴포넌트 모음
│  │  ├─ auth/
│  │  │  └─ LoginForm.tsx        # 로그인 폼 컴포넌트
│  │  ├─ common/                 # 공통 컴포넌트
│  │  │  └─ Header.tsx           # 상단 네비게이션 헤더
│  │  ├─ instructor/             # 강사 전용 컴포넌트
│  │  │  └─ InstructorSidebar.tsx# 강사용 사이드바
│  └─ styles/                    # 전역 스타일 (globals.css, tailwind.css)
├─ .eslintrc.cjs
├─ .prettierrc
├─ next.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

### 🧩 폴더 요약

- **src/app** → 페이지 단위 구조 (Next.js 라우팅 기반)
- **src/components** → 공통 UI 및 모듈화된 컴포넌트

  - `auth/` : 로그인, 회원가입 등 인증 관련
  - `common/` : Header, Button, Layout 등 모든 페이지에서 공통으로 사용하는 UI
  - `instructor/` : 강사용 전용 UI 컴포넌트 모음

- **src/styles** → 전역 스타일 정의
- **src/lib, hooks, configs** → API, 커스텀 훅, 환경설정

---

## 🧪 커밋 & 브랜치 전략

```
main        # 안정 배포용
develop     # 통합 개발용 (세팅/공통)
feature/*   # 기능 단위 개발
```

### Commit Convention

- `feat:` 새 기능 추가
- `fix:` 버그 수정
- `style:` 스타일 변경
- `refactor:` 코드 구조 변경
- `chore:` 설정/빌드 관련 변경
- `docs:` 문서 수정

---

## 🗺️ 작업 순서

1. `feature/작업이름` 브랜치 생성
2. 담당 페이지 구현
3. 브라우저에서 화면 확인 후 커밋 + PR
4. 코드리뷰 → `develop` 병합
