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

## 5. 추가 아키텍처 개선 제안 (심화)

`library-search` 페이지의 코드베이스를 분석한 결과, 전반적으로 **Lit 기반의 웹 컴포넌트 활용**, **Reactive Controller(`InfiniteScrollController`, `StoreController`) 도입**, 그리고 **CSS `content-visibility`를 활용한 렌더링 최적화** 등 최신 바닐라 JS 생태계의 좋은 패턴들이 이미 잘 적용되어 있습니다. 프레임워크에 과도하게 의존하지 않고 높은 품질을 지향하는 '장인 정신'이 돋보이는 구조입니다.

이러한 훌륭한 기반 위에서, **성능을 한계까지 끌어올리고 대규모 확장 시에도 흔들림 없는 유지보수성을 확보하기 위한 아키텍처 개선 방향 5가지**를 제안합니다.

### 5.1. 전역 상태 구독 구조 개선 (O(1) 구독 아키텍처)
**[현재 구조 및 문제점]**
`LibrarySearchItem.ts`를 보면 각 아이템이 `StoreController`를 인스턴스화하여 전역 상태인 `bookModel`(`BookModelEvent.LibraryUpdate`)을 개별적으로 구독하고 있습니다. 리스트가 100개, 500개로 늘어나면 **수백 개의 리스너가 메모리에 적재**되고 이벤트 발생 시 불필요한 오버헤드가 발생합니다.

**[개선 방향]**
컴포넌트 단위의 개별 구독을 폐기하고, **부모 컴포넌트(Container)에서 단일 구독(Single Subscription) 후 하향식(Top-down)으로 데이터를 주입**하는 패턴으로 변경해야 합니다.
*   `PageLibrarySearch`(혹은 리스트 컨테이너)에서 한 번만 `bookModel`을 구독합니다.
*   관심 도서관 코드를 `Set<string>` 형태로 캐싱합니다.
*   아이템 렌더링 시 `.selected=${savedSet.has(item.libCode)}` 형태로 전달하여, 아이템 컴포넌트는 상태를 모르는 순수(Dumb/Presentational) 컴포넌트로 만듭니다.

### 5.2. 메모리 최적화를 위한 Virtual Scrolling Controller 도입
**[현재 구조 및 문제점]**
현재 `library-search-item`에 CSS `content-visibility: auto; contain-intrinsic-size`를 적용하여 렌더링 성능을 최적화한 것은 매우 훌륭한 접근입니다. 하지만 무한 스크롤로 인해 데이터가 누적되면 **DOM 노드 자체의 개수가 무한히 증가**하여 브라우저의 메모리 점유율이 상승하고 레이아웃 계산 비용이 점진적으로 증가합니다.

**[개선 방향]**
화면에 보이지 않는 노드는 실제로 DOM에서 제거하거나 재활용(DOM Recycling)하는 **Virtual List (Windowing) Controller**를 바닐라 JS로 직접 구현하여 Lit의 Reactive Controller로 연결하는 것을 추천합니다. 
*   Lit의 `@lit-labs/virtualizer`를 참고하거나 직접 Intersection Observer와 스크롤 포지션을 계산하여 가시 영역의 ±1 화면 정도의 노드만 유지하도록 렌더링을 제한하면 수만 개의 리스트도 60fps로 매끄럽게 처리할 수 있습니다.

### 5.3. 컴포넌트 책임 분리 (Separation of Concerns) 심화
**[현재 구조 및 문제점]**
`PageLibrarySearch.ts`가 **God Object** 성향을 띠고 있습니다. 무한 스크롤 제어, 디바운싱, 폼 이벤트 처리, 이벤트 위임(`handleListChange`), 전역 스토어 상태 동기화 등을 모두 한 곳에서 처리하고 있습니다.

**[개선 방향]**
도메인 논리와 뷰 논리를 명확히 분리하기 위해 `LibrarySearchList` 컴포넌트를 신설해야 합니다.
*   **`PageLibrarySearch` (Container)**: `LibrarySearchStore`와 통신하고 하위 컴포넌트들을 조립하는 레이아웃 및 상태 공급 역할만 수행합니다.
*   **`LibrarySearchList` (Presentation)**: 무한 스크롤(`InfiniteScrollController`)과 리스트 렌더링, 이벤트 위임을 전담합니다.
이렇게 분리하면 향후 다른 페이지에서 도서관 검색 리스트 UI가 필요할 때 완벽하게 재사용할 수 있습니다.

### 5.4. Shadow DOM 전환을 통한 스타일 및 뷰 캡슐화
**[현재 구조 및 문제점]**
대부분의 컴포넌트가 `createRenderRoot() { return this; }`를 사용하여 Light DOM을 강제하고 전역 SCSS(`library-search.scss`)에 의존하고 있습니다. 이는 당장 구현하기엔 편하지만, 시스템이 커지면 CSS 클래스명 충돌이나 예상치 못한 사이드 이펙트를 유발하여 웹 컴포넌트 본연의 장점인 '완벽한 캡슐화'를 해칩니다.

**[개선 방향]**
*   **Shadow DOM을 활성화**(`createRenderRoot` 오버라이드 제거)하고, Lit의 `css` tagged template(Adoptable Stylesheets)을 사용하여 컴포넌트 내부로 스타일을 이동시킵니다.
*   현재 전역으로 뺀 SCSS(`base`, `components/button` 등)는 CSS Variables(Custom Properties)로 전환하거나 공유 스타일 객체로 만들어 각 컴포넌트에 주입하는 모던한 방식을 취하는 것이 유지보수에 훨씬 유리합니다.

### 5.5. 인메모리 검색 캐싱(API Caching) 계층 추가
**[현재 구조 및 문제점]**
`LibrarySearchStore`는 `AbortController`를 통해 불필요한 네트워크 요청을 훌륭히 취소하고 있습니다. 하지만 사용자가 '강남' 검색 후 '서초'를 검색했다가 다시 '강남'을 검색할 경우, 이미 아는 데이터임에도 다시 네트워크 요청을 보냅니다.

**[개선 방향]**
`LibrarySearchStore` 내부에 간단한 **LRU (Least Recently Used) Cache** 혹은 `Map`을 구현하여 네트워크 계층을 최적화합니다.
*   `cache.get(keyword_page)`로 먼저 확인하고, 히트 시 API 호출 없이 즉시 상태를 업데이트하여 체감 속도를 '0ms'로 만듭니다.
*   캐시가 없을 때만 `LibraryApiService`를 호출하도록 하여 불필요한 서버 부하를 줄이고 극한의 사용자 경험을 제공할 수 있습니다.
