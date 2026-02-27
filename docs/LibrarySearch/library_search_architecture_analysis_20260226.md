# Library Search Architecture Analysis & Recommendations (2026-02-26)

## 1. 현재 아키텍처 분석 (Current State Analysis)

현재 `library-search`는 **LitElement(UI 렌더링) + 순수 바닐라 JS Store(상태 관리)**가 결합된 하이브리드 아키텍처를 띄고 있습니다.

**👍 주요 장점:**
*   **관심사 분리 (Separation of Concerns):** `LibrarySearchStore`가 비즈니스 로직(API, 페이징)을, 컴포넌트가 UI를 전담함.
*   **네트워크 최적화:** `AbortController`를 통한 경쟁 상태(Race Condition) 방지 및 `debounce` 적용.
*   **효율적 이벤트 핸들링:** 부모 컨테이너에서 이벤트 위임(Event Delegation)을 통해 메모리 사용 최적화.
*   **렌더링 경량화:** Light DOM을 활용하여 Shadow DOM 오버헤드 제거.

---

## 2. 성능 병목 및 구조적 한계점 (Identify Bottlenecks)

**🚨 1. 가상 스크롤(Virtual Scrolling) 부재**
*   데이터 누적 시 DOM 노드 증가로 인한 브라우저 렌더링 성능(Layout/Paint) 저하.
*   수백 개 이상의 결과 출력 시 스크롤 성능(Jank) 발생 가능성.

**🚨 2. 과도한 리렌더링 (Over-rendering)**
*   전역 상태(`bookModel`) 변경 시 부모 컴포넌트(`PageLibrarySearch`) 전체가 반응하여 리스트 전체를 Diffing함.
*   세밀한 반응성(Fine-grained Reactivity) 부족으로 인한 불필요한 연산 발생.

**🚨 3. 프레임워크 의존성**
*   LitElement의 생명주기 관리 및 템플릿 파싱 오버헤드가 순수 바닐라 JS 대비 존재함.

---

## 3. 아키텍처 개선 방향 (Architectural Recommendations)

### 단계 1: 데이터 기반 가상 스크롤 (Virtual Scrolling) 도입
*   **목표:** 실제 화면에 보이는 영역만 DOM으로 렌더링하여 60fps 유지.
*   **방안:** 스크롤 위치에 따라 `startIndex`, `endIndex`를 계산하고 해당 배열만 슬라이싱하여 렌더링하는 Virtual List 알고리즘 구현.

### 단계 2: 세밀한 반응성 (Fine-grained Reactivity) 적용
*   **목표:** 상태 변경 시 영향을 받는 최소 단위의 DOM만 직접 업데이트.
*   **방안:** 부모의 전체 구독을 해제하고, 데이터 ID(`libCode`)를 기반으로 특정 아이템의 상태만 O(1) 비용으로 직접 조작(Direct DOM Manipulation).

### 단계 3: 상태 업데이트 배칭 (State Batching) 구현
*   **목표:** 짧은 시간 내 다수의 상태 변경을 하나로 묶어 렌더링 횟수 최소화.
*   **방안:** `Microtask Queue`(`queueMicrotask` 등)를 활용하여 이벤트 루프 1틱당 단 한 번의 통지만 발생하도록 `Publisher` 개선.

### 단계 4: 순수 Web Components (Vanilla JS) 전환
*   **목표:** 프레임워크 추상화 레이어를 제거하여 런타임 성능 극대화.
*   **방안:** `HTMLElement`를 상속받는 네이티브 커스텀 엘리먼트로 전환하고, 필요한 시점에만 부분 업데이트를 수행하는 최적화된 렌더링 엔진 구축.