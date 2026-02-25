# 웹 컴포넌트 아키텍처 리뷰 및 개선 제안 (2026-02-25)

## 1. 개요
현재 `library-search` 페이지의 Lit 기반 웹 컴포넌트 구조를 분석하고, 성능 최적화 및 유지보수성 향상을 위한 아키텍처 개선 방향을 제시함. 2026년 2월 25일 기준, 주요 아키텍처 개선 사항이 성공적으로 반영되었음.

## 2. 컴포넌트 분석 및 최적화 성과 (리팩토링 완료)

### 2.1. 비즈니스 로직의 완벽한 분리 (Store 패턴 적용)
*   **성과:** `PageLibrarySearch` 컴포넌트 내부에 혼재되어 있던 API 호출 및 상태 관리 로직을 **`LibrarySearchStore`**로 완전히 이관함.
*   **이점:** 컴포넌트는 UI 렌더링에만 집중하고, 데이터 흐름은 Store를 통해 단방향으로 관리됨. `AbortController`를 통한 이전 요청 취소 및 실시간 검색(Debouncing) 로직이 Store 수준에서 견고하게 처리됨.

### 2.2. 상태 관리 현대화: StoreController 및 Reactive Controller
*   **성과:** `StoreController`를 도입하여 `bookModel`(관심 도서관) 및 `LibrarySearchStore`와의 상태 동기화를 자동화함.
*   **이점:** 컴포넌트 생명주기에 따른 구독/해제 보일러플레이트 제거 및 메모리 누수 방지.

### 2.3. 무한 스크롤 로직의 모듈화 (InfiniteScrollController)
*   **성과:** `IntersectionObserver` 로직을 **`InfiniteScrollController`**라는 재사용 가능한 Reactive Controller로 추상화함.
*   **이점:** 어느 컴포넌트에서든 `new InfiniteScrollController(...)` 호출만으로 무한 스크롤 기능을 즉시 부착할 수 있는 확장성 확보.

### 2.4. 에러 핸들링 및 UX 개선 (ErrorFallback 컴포넌트)
*   **성과:** API 통신 실패 시 '다시 시도' 기능을 제공하는 **`<error-fallback>`** 컴포넌트를 구현하고 스타일을 SCSS로 분리함.
*   **이점:** 예외 상황에 대한 일관된 사용자 경험(UX) 제공 및 선언적인 에러 UI 관리 가능.

### 2.5. 대량 데이터 렌더링 최적화 (Modern CSS)
*   **성과:** `<library-search-item>`에 **CSS `content-visibility: auto;`** 및 `contain-intrinsic-size` 적용.
*   **이점:** 수천 개의 아이템이 존재하더라도 브라우저 레이아웃 계산 비용을 최소화하여 압도적인 스크롤 성능 확보.

## 3. 향후 아키텍처 고도화 방향 (Next Level)

현재의 견고한 구조 위에서 한 단계 더 나아가기 위한 장인 정신 기반의 제안입니다.

### 3.1. 책임 분리 (SoC): 검색 폼 컴포넌트 추출
*   **현황:** 현재 `<page-library-search>` 렌더링 함수 내에 검색 폼(`form.search-form`) UI와 핸들러가 포함되어 있음.
*   **제안:** `<library-search-form>`을 독립 컴포넌트로 분리. 검색어 입력 시 Custom Event를 발생시켜 부모에게 전달하는 구조로 변경하여 컴포넌트 비대화 방지 및 재사용성 향상.

### 3.2. 서비스 레이어(Service Layer) 도입 및 API 추상화
*   **현황:** `LibrarySearchStore` 내부에 API 엔드포인트 URL이 하드코딩되어 있음.
*   **제안:** API 요청만 전담하는 `LibraryApiService.ts`를 생성. Store는 서비스를 호출하여 데이터만 수신하게 함으로써 유닛 테스트 용이성 및 유지보수성 극대화.

### 3.3. 이벤트 위임(Event Delegation)을 통한 성능 극대화
*   **현황:** 각 `<library-search-item>` 내부의 체크박스에 개별적으로 이벤트 리스너가 바인딩됨.
*   **제안:** 리스트 부모 레벨(`<div class="library-list">`)에서 이벤트를 하나만 등록하고 `event.target.closest`를 활용해 처리하는 방식 검토 (아이템 수가 극단적으로 많아질 경우 유리).

### 3.4. 디자인 시스템 기반의 스타일 캡슐화 고민
*   **현황:** 현재 전역 SCSS를 활용하기 위해 Light DOM(`createRenderRoot() { return this; }`)을 주로 사용 중임.
*   **제안:** 컴포넌트 규모 확장에 따른 스타일 충돌 방지를 위해, 공통 테마를 JS 모듈로 정의하고 Shadow DOM의 `static styles`를 활용하는 진정한 캡슐화(Encapsulation) 로드맵 검토.

## 4. 결론
2026-02-25 리팩토링을 통해 **"프레임워크 없이도 최고 수준의 성능과 구조를 가진 바닐라 JS 기반 웹 애플리케이션"**의 기틀을 완성함. 앞으로는 각 컴포넌트의 책임을 더 세밀하게 나누고(SoC), 전역 상태와 로컬 상태의 경계를 명확히 하여 유지보수 비용을 낮추는 방향으로 정진할 것을 권장함.
