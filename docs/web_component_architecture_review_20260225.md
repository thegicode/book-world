# 웹 컴포넌트 아키텍처 리뷰 및 개선 제안 (2026-02-25)

## 1. 개요
현재 `library-search` 페이지의 Lit 기반 웹 컴포넌트 구조를 분석하고, 성능 최적화 및 유지보수성 향상을 위한 아키텍처 개선 방향을 제시함.

## 2. 컴포넌트 분석 및 최적화 제안 (리팩토링 완료)

### 2.1. 불필요한 컴포넌트 제거 (Over-engineering 개선)
*   **대상:** `<library-search-list>` (`LibrarySearchList.ts`)
*   **분석:** 현재 이 컴포넌트는 부모로부터 받은 데이터를 단순히 순회(`repeat`)하여 아이템을 렌더링하는 'Pass-through' 역할만 수행 중임. 독립적인 상태나 복잡한 로직이 없어 Custom Element로서의 실익이 낮음.
*   **추천 (완료):** 
    *   해당 컴포넌트를 제거하고 부모인 `<page-library-search>`에서 직접 렌더링.
    *   불필요한 DOM Depth를 줄여 렌더링 성능 최적화 및 코드 복잡도 감소.

### 2.2. 상태 관리 현대화: Reactive Controller 패턴
*   **현황:** `LibrarySearchItem` 및 `LibrarySearchStored`에서 `bookModel`을 수동으로 구독(`subscribe`/`unsubscribe`) 중임.
*   **문제점:** 생명주기 메서드마다 반복되는 구독 로직(Boilerplate)이 발생하며, 해제 누락 시 메모리 누수 위험이 있음.
*   **추천 (완료):**
    *   **StoreController** 도입: Lit의 Reactive Controller API를 활용하여 모델 구독 로직을 캡슐화.
    *   컴포넌트는 `new StoreController(this, bookModel)` 호출만으로 상태 동기화 및 자동 업데이트(Automatic `requestUpdate`)가 가능해짐.

### 2.3. 대량 데이터 렌더링: 성능 최적화 (Modern CSS)
*   **현황:** 무한 스크롤(Infinite Scroll) 방식으로 인해 데이터가 늘어날수록 DOM 노드 수가 무한히 증가하여 브라우저 렌더링 병목(Reflow/Repaint) 발생.
*   **문제점:** 모바일 환경이나 저사양 기기에서 스크롤 버벅임 및 메모리 압박 유발.
*   **추천 (완료):**
    *   JS 기반의 복잡한 가상 스크롤(Virtual Scrolling) 대신, 웹 표준인 **CSS `content-visibility: auto;`** 와 `contain-intrinsic-size`를 도입.
    *   브라우저 엔진 레벨에서 화면 밖(Off-screen) 노드의 렌더링을 건너뛰어(Skip), 수천 개의 DOM 요소가 존재하더라도 압도적인 초기 로딩 속도와 부드러운 스크롤 성능을 확보함.

## 3. 유지보수성 및 성능 극대화를 위한 추가 개선 방향 (Next Level)

현재 구조도 매우 훌륭하지만, 애플리케이션의 규모 확장에 대비하여 아키텍처 장인정신을 발휘할 수 있는 추가적인 개선안입니다.

### 3.1. 비즈니스 로직의 완벽한 분리 (API 및 상태의 Store 이관)
*   **현황:** `PageLibrarySearch` 컴포넌트 내부에 API 호출(`CustomFetch.fetch`)과 로컬 상태(`_items`, `_page`, `_loading` 등)가 혼재되어 있음.
*   **문제점:** View(UI) 역할을 수행해야 할 컴포넌트가 Controller(비즈니스 로직) 역할까지 담당하여 코드가 비대해짐. 다른 페이지에서 검색 기능을 재사용하기 어려움.
*   **추천:** 
    *   도서 검색 기능과 마찬가지로, **도서관 검색 상태와 API 통신 로직을 전용 Store(예: `LibrarySearchStore` 생성 또는 `bookModel` 확장)로 완전히 이관**함.
    *   컴포넌트는 `this.store.search(keyword)`만 호출하고, 화면 렌더링은 `StoreController`를 통해 단방향으로 수신받은 상태 변화에 반응하여 수동적으로만 이루어지게 설계함 (단방향 데이터 흐름).

### 3.2. 무한 스크롤 로직의 모듈화 (InfiniteScrollController)
*   **현황:** `IntersectionObserver`를 활용한 무한 스크롤(Sentinel 감시) 코드가 `PageLibrarySearch` 컴포넌트에 강하게 결합되어 있음.
*   **문제점:** 다른 페이지나 컴포넌트에서 무한 스크롤이 필요할 때 동일한 로직(Observer 등록, 해제, 감시 등)이 중복됨.
*   **추천:**
    *   상태 관리 컨트롤러를 구축한 것처럼, **`InfiniteScrollController`라는 재사용 가능한 Lit Reactive Controller를 생성**하여 추상화함.
    *   `new InfiniteScrollController(this, sentinelElement, loadMoreCallback)` 형태로 단 한 줄의 코드로 어느 컴포넌트에서든 무한 스크롤 기능을 즉시 부착할 수 있도록 설계함.

### 3.3. 디바운싱(Debouncing) 기반의 실시간 검색 경험 고도화
*   **현황:** 폼의 Submit(엔터 또는 클릭) 이벤트가 발생해야만 검색이 시작됨.
*   **추천:**
    *   사용자의 타이핑(Input 이벤트)에 반응하여 실시간으로 검색 결과를 제공하되, 무의미한 API 호출 폭주를 방지하기 위해 **Debounce(예: 300ms 대기) 기법을 도입**함.
    *   새로운 검색어 입력 시, 현재 진행 중인 이전 네트워크 요청이 있다면 `AbortController`를 적극 호출하여 네트워크 단에서 취소(Cancel)함으로써 불필요한 트래픽을 아끼고 항상 최신 데이터의 무결성을 보장함.

### 3.4. 에러 경계 (Error Boundary) 및 UX 지향적 Fallback 전략
*   **현황:** API 실패나 에러 발생 시 단순 문자열(`this._error`)만 UI 하단에 출력됨.
*   **추천:**
    *   네트워크 오류 등 예외 상황 발생 시 사용자에게 **'다시 시도(Retry)' 액션을 제공하는 모듈화된 Error UI 컴포넌트**를 도입함.
    *   에러 상태를 단순히 텍스트로 보관하지 않고, 에러 객체(코드, 메시지)로 세분화하여 상황에 맞는 시각적 피드백(Toast 알림 연동 등)을 능동적으로 제공하도록 설계함.

## 4. 결론
Lit의 장점(Reactive Controller, Lifecycle, 속도)과 최신 웹 표준 기술(CSS `content-visibility`)을 융합하여 기존의 불필요한 DOM 계층과 JS 보일러플레이트를 성공적으로 제거하였음. 

앞으로는 UI 렌더링 계층(View)과 데이터/비즈니스 계층(Model/Store)을 완전히 분리하는 작업을 통해, 코드의 순수성(Purity)과 재사용성을 극한으로 끌어올리는 '관심사 분리(SoC)' 완성에 주력하는 것을 권장함.