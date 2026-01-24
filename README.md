# CERTICOS BOOKS

도서 검색 및 관리 애플리케이션

## 프로젝트 개요

CERTICOS BOOKS는 카카오 도서 검색 API를 활용한 도서 검색 및 관리 웹 애플리케이션입니다. 사용자는 도서를 검색하고, 찜한 도서를 관리하며, 검색 이력을 확인할 수 있습니다.

### 주요 기능

-   **도서 검색**: 카카오 도서 검색 API를 통한 실시간 도서 검색
-   **상세 검색**: 제목, 출판사, 저자명으로 세분화된 검색
-   **검색 이력 관리**: 최근 검색어 8개까지 저장 및 관리
-   **찜한 도서 관리**: 관심 있는 도서를 찜하여 별도 페이지에서 확인
-   **무한 스크롤**: 검색 결과를 자동으로 추가 로드
-   **상태 유지**: 페이지 전환 시 메인 페이지의 검색 상태 유지

## 실행 방법 및 환경 설정

### 필수 요구사항

-   Node.js 18 이상
-   npm 또는 yarn

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 폴더 구조 및 주요 코드 설명

```
src/
├── api/                    # API 관련 코드
│   ├── BookFetcher.ts      # 카카오 도서 검색 API 연동
│   └── mock/               # Mock API
│       ├── likedBooksFetcher.ts      # 찜한 도서 관리 (React Query)
│       └── searchHistoryFetcher.ts   # 검색 이력 관리 (React Query)
│
├── assets/                 # 정적 리소스
│   ├── font/              # 폰트 파일
│   └── icon/              # 아이콘 SVG 파일
│
├── common/                 # 공통 컴포넌트 및 유틸리티
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   │   ├── BookList.tsx           # 도서 목록 컴포넌트
│   │   ├── Menu.tsx               # 네비게이션 메뉴
│   │   ├── Popover.tsx            # 범용 팝오버 컴포넌트
│   │   └── SearchResultSection.tsx # 검색 결과 영역
│   │
│   ├── editor/            # 폼 입력 컴포넌트
│   │   ├── Button.ts              # 버튼 컴포넌트
│   │   ├── SearchPanel.tsx        # 검색 입력 패널 (검색 이력 포함)
│   │   ├── SelectBox.tsx          # 커스텀 드롭다운
│   │   └── TextBox.tsx            # 텍스트 입력
│   │
│   ├── hooks/              # 커스텀 훅
│   │   └── useDebounce.ts         # 디바운스 훅
│   │
│   ├── layout/             # 레이아웃 컴포넌트
│   │   └── PageCommon.tsx         # 공통 페이지 레이아웃 (헤더, 메뉴)
│   │
│   ├── style/               # 스타일 유틸리티
│   │   └── FlexContainer.ts      # Flexbox 컨테이너
│   │
│   └── theme/             # 테마 설정
│       ├── colors.ts              # 색상 팔레트
│       └── font.ts                # 폰트 스타일
│
├── pages/                  # 페이지 컴포넌트
│   ├── Page_Home.tsx       # 메인 검색 페이지
│   └── Page_LikedBooks.tsx # 찜한 도서 페이지
│
├── App.tsx                 # 라우팅 설정
└── main.tsx                # 애플리케이션 진입점

public/
└── mock/                   # Mock 데이터 파일
    ├── liked.json          # 찜한 도서 데이터
    └── searchHistory.json  # 검색 이력 데이터
```

### 주요 컴포넌트 설명

#### `SearchPanel` (`common/editor/SearchPanel.tsx`)

-   검색 입력 필드와 검색 이력 표시를 통합한 컴포넌트
-   포커스 시 검색 이력 자동 표시
-   검색 이력 클릭 시 해당 검색어로 검색 실행
-   검색 이력 삭제 기능

#### `BookList` (`common/components/BookList.tsx`)

-   도서 목록을 카드 형태로 표시
-   찜하기 기능 (하트 아이콘)
-   상세 정보 확장/축소 애니메이션
-   무한 스크롤 지원

#### `Popover` (`common/components/Popover.tsx`)

-   범용 팝오버 컴포넌트
-   타겟 요소 기준 동적 위치 조정
-   외부 클릭 시 자동 닫기 옵션

#### `PageCommon` (`common/layout/PageCommon.tsx`)

-   공통 레이아웃 (헤더, 메뉴)
-   최대 너비 960px 제한
-   페이지 전환 시 상태 유지

## 라이브러리 선택 이유

### TanStack Query (React Query) v5

-   **선택 이유**: 서버 상태 관리와 캐싱을 위한 표준 라이브러리
-   무한 스크롤을 위한 `useInfiniteQuery` 제공
-   자동 캐싱 및 리페칭으로 성능 최적화
-   Mock API 데이터도 React Query로 일관성 있게 관리

### Emotion (styled-components)

-   **선택 이유**: CSS-in-JS로 컴포넌트와 스타일을 함께 관리
-   TypeScript와의 우수한 통합
-   동적 스타일링이 용이

### Axios

-   **선택 이유**: `fetch`보다 풍부한 기능과 인터셉터 지원
-   Mock API와 실제 API 호출의 일관성 유지

### Vite

-   **선택 이유**: 빠른 개발 서버와 HMR
-   커스텀 미들웨어로 Mock API 파일 쓰기 구현

## 강조하고 싶은 기능

### 1. 페이지 전환 시 상태 유지

-   React Router의 일반적인 unmount 방식 대신, 모든 페이지를 항상 마운트 상태로 유지
-   `position: absolute`와 `display: none/block`으로 페이지 전환 구현
-   메인 페이지의 검색 상태, 스크롤 위치 등이 페이지 전환 후에도 그대로 유지

### 2. Mock API 파일 시스템 연동

-   Vite 개발 서버의 커스텀 미들웨어로 `public/mock/*.json` 파일에 직접 쓰기
-   브라우저에서 파일 시스템에 직접 쓰기 불가능한 제약을 서버 미들웨어로 해결
-   React Query를 통한 일관된 데이터 관리

### 3. 무한 스크롤 구현

-   `useInfiniteQuery`를 활용한 효율적인 페이지네이션
-   자동으로 다음 페이지 로드
-   검색 결과와 찜한 도서 목록 모두 동일한 패턴으로 구현

### 4. 재사용 가능한 컴포넌트 아키텍처

-   `SearchResultSection`: 검색 결과와 찜한 도서 목록의 공통 UI 추상화
-   `Popover`: 범용 팝오버로 SelectBox, 상세 검색 등에서 재사용
-   `PageCommon`: 공통 레이아웃으로 코드 중복 제거
