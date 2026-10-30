# DBP_FE

CampusMarket 프론트엔드 레포지토리입니다.

<br />

## 🛠 기술 스택

| 구분            | 기술                                              |
| --------------- | ------------------------------------------------- |
| Framework       | React 19 + TypeScript                             |
| Build Tool      | Vite 8                                            |
| Routing         | React Router                                      |
| Server State    | TanStack Query                                    |
| Client State    | zustand                                           |
| Styling         | 일반 CSS (BEM 방식 클래스명, 컴포넌트별 CSS 파일) |
| Code Quality    | ESLint + Prettier                                 |
| Git Convention  | Husky + lint-staged + Commitlint                  |
| Test            | Vitest + Testing Library                          |
| Package Manager | pnpm                                              |

<br />

## 🚀 시작하기

### 사전 준비

- Node.js **22.22.0 이상** (`node -v` 로 확인)
- pnpm

```bash
npm install -g pnpm
```

### 설치 및 실행

```bash
git clone https://github.com/DBP2/DBP_FE.git
cd DBP_FE
git checkout develop

pnpm install                # 의존성 설치 (+ Husky 훅 자동 설정)
cp .env.example .env.local  # 환경변수 설정 (Windows: copy .env.example .env.local)
pnpm dev                    # 개발 서버 실행 → http://localhost:5173
```

### 스크립트

| 명령어              | 설명                       |
| ------------------- | -------------------------- |
| `pnpm dev`          | 개발 서버 실행             |
| `pnpm build`        | 타입 체크 후 프로덕션 빌드 |
| `pnpm preview`      | 빌드 결과물 미리보기       |
| `pnpm typecheck`    | TypeScript 타입 체크       |
| `pnpm lint`         | ESLint 검사                |
| `pnpm lint:fix`     | ESLint 자동 수정           |
| `pnpm format`       | Prettier 포맷 적용         |
| `pnpm format:check` | Prettier 포맷 검사         |
| `pnpm test`         | 테스트 실행                |
| `pnpm test:watch`   | 테스트 watch 모드          |

> 💡 VS Code 사용 시 추천 확장(ESLint, Prettier)을 설치하면 저장할 때 자동으로 포맷됩니다.

<br />

## 📁 폴더 구조

```
src/
├── api/             # API 호출 (client.ts 공통 fetch 래퍼, 도메인별 파일)
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/
│   ├── common/      # 앱 전체 공용 컴포넌트
│   └── [page]/      # 페이지 전용 컴포넌트
├── constants/       # 여러 도메인에서 공유하는 상수
├── hooks/           # 커스텀 훅
├── lib/             # 외부 라이브러리 설정 (TanStack Query 등)
├── mocks/           # 백엔드 연결 전 사용하는 예시 데이터
├── pages/           # 라우트 단위 페이지
├── router/          # 라우트 설정
├── store/           # 전역 상태 (zustand)
├── styles/          # 전역 스타일 (리셋, CSS 변수)
├── test/            # 테스트 공통 셋업
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸 함수
```

- import 시 `@/` 절대경로를 사용합니다. 예) `import { cn } from '@/utils/cn';`

<br />

## 🎨 스타일 규칙

컴포넌트마다 같은 이름의 CSS 파일을 두고, 클래스명은 **BEM(Block\_\_Element--Modifier)** 방식으로 작성합니다.

```
components/product/
├── ProductCard.tsx
└── ProductCard.css
```

```tsx
import { cn } from '@/utils/cn';
import './ProductCard.css';

export default function ProductCard({ isSoldOut }: { isSoldOut: boolean }) {
  return (
    <article className={cn('product-card', isSoldOut && 'product-card--sold-out')}>
      <h3 className="product-card__title">상품명</h3>
    </article>
  );
}
```

- Block은 컴포넌트 이름의 kebab-case (`ProductCard` → `.product-card`) 로 지어 다른 파일과 클래스명이 겹치지 않게 합니다.
- 색상, 반경 등 공통 값은 `styles/global.css` 의 CSS 변수(`var(--color-primary)`)를 사용합니다.

<br />

## 🤝 협업 규칙

### 이슈 규칙

- 작업 시작 전 **이슈 먼저 생성**
- 이슈 제목 형식: `[FEAT] 기능명` / `[FIX] 버그명`
- 이슈 템플릿(`.github/ISSUE_TEMPLATE`) 사용
  - 기능 요청 → `feature.md`
  - 버그 리포트 → `bug.md`

### 브랜치 전략

| 브랜치                  | 설명                            |
| ----------------------- | ------------------------------- |
| `main`                  | 배포 브랜치. **직접 push 금지** |
| `develop`               | 개발 통합 브랜치                |
| `feat/#이슈번호-기능명` | 기능 개발                       |
| `fix/#이슈번호-버그명`  | 버그 수정                       |

예시: `feat/#12-login-page` / `fix/#34-button-style`

```bash
git checkout develop
git pull origin develop
git checkout -b feat/#12-login-page
```

작업 기간이 길어져 develop과 차이가 벌어지면, **PR을 올리기 전 develop을 작업 브랜치에 병합**해 충돌을 미리 해결합니다.

```bash
git checkout feat/#12-login-page
git pull origin develop   # 충돌 해결 후 커밋
```

### 커밋 컨벤션

형식: `타입: 제목`

| 타입       | 설명                            |
| ---------- | ------------------------------- |
| `feat`     | 새로운 기능                     |
| `fix`      | 버그 수정                       |
| `style`    | UI/스타일 변경 (기능 변화 없음) |
| `refactor` | 리팩토링                        |
| `chore`    | 설정, 패키지 등 기타 변경       |
| `docs`     | 문서 수정                       |
| `test`     | 테스트 추가/수정                |
| `revert`   | 커밋 되돌리기                   |

예시: `feat: 로그인 페이지 구현` / `fix: 버튼 클릭 시 이벤트 중복 실행 수정`

> ⚠️ 커밋 형식이 맞지 않으면 **자동으로 커밋이 막힙니다.** (Husky + Commitlint)
> 커밋 시 변경된 파일에 ESLint / Prettier가 자동 적용됩니다. (lint-staged)

### PR 규칙

- PR 제목은 커밋 컨벤션과 동일한 형식
- **이슈 없이 PR 금지** (`closes #이슈번호` 필수)
- PR 템플릿(`.github/pull_request_template.md`) 양식에 맞춰 작성
- `feat` / `fix` 브랜치 → `develop` 으로 PR
- `develop` → `main` 은 배포 시점에만 머지
- PR 승인 **1명 이상** 필수
- PR의 모든 리뷰 댓글 resolve 후 머지
- 리뷰 요청 후 팀원들에게 공지
- PR 생성 시 CI가 자동으로 **PR 제목, 타입 체크, 린트, 포맷, 테스트, 빌드**를 검증

### 소통 및 회의 규칙

- 작업 완료 시 팀 채널에 공유
- 작업 지연이나 이슈 발생 시 즉시 공유
