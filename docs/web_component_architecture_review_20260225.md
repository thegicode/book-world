# 웹 컴포넌트 아키텍처 리뷰 및 개선 제안 (2026-02-25)

## 1. 개요
현재 `library-search` 페이지의 Lit 기반 웹 컴포넌트 구조를 분석하고, 성능 최적화 및 유지보수성 향상을 위한 아키텍처 개선 방향을 제시함.

## 2. 컴포넌트 분석 및 최적화 제안

### 2.1. 불필요한 컴포넌트 제거 (Over-engineering 개선)
*   **대상:** `<library-search-list>` (`LibrarySearchList.ts`)
*   **분석:** 현재 이 컴포넌트는 부모로부터 받은 데이터를 단순히 순회(`repeat`)하여 아이템을 렌더링하는 'Pass-through' 역할만 수행 중임. 독립적인 상태나 복잡한 로직이 없어 Custom Element로서의 실익이 낮음.
*   **추천:** 
    *   해당 컴포넌트를 제거하고 부모인 `<page-library-search>`에서 직접 렌더링.
    *   불필요한 DOM Depth를 줄여 렌더링 성능 최적화 및 코드 복잡도 감소.

### 2.2. 상태 관리 현대화: Reactive Controller 패턴
*   **현황:** `LibrarySearchItem` 및 `LibrarySearchStored`에서 `bookModel`을 수동으로 구독(`subscribe`/`unsubscribe`) 중임.
*   **문제점:** 생명주기 메서드마다 반복되는 구독 로직(Boilerplate)이 발생하며, 해제 누락 시 메모리 누수 위험이 있음.
*   **추천:**
    *   **StoreController** 도입: Lit의 Reactive Controller API를 활용하여 모델 구독 로직을 캡슐화.
    *   컴포넌트는 `new StoreController(this, bookModel)` 호출만으로 상태 동기화 및 자동 업데이트(Automatic `requestUpdate`)가 가능해짐.

### 2.3. 대량 데이터 처리: Virtual Scrolling
*   **현황:** 무한 스크롤(Infinite Scroll) 방식으로 인해 데이터가 늘어날수록 DOM 노드 수가 무한히 증가함.
*   **문제점:** 모바일 환경이나 저사양 기기에서 Reflow 성능 저하 및 메모리 압박 유발.
*   **추천:**
    *   화면에 보이는 영역(Viewport)의 노드만 유지하는 가상 스크롤 기법 도입 고려.
    *   바닐라 JS의 장인정신을 살린 고성능 리스트 렌더링 아키텍처의 완성.

## 3. 결론
현재의 Lit 전환은 매우 올바른 방향이나, 단순 래퍼 컴포넌트는 지양하여 DOM 구조를 평탄화(Flat)하고, 반복되는 상태 구독 로직은 컨트롤러 패턴으로 추상화하여 코드의 순수성을 높이는 방향을 권장함.
