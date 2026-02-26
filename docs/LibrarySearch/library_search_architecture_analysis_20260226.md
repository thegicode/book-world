# Library Search 페이지 아키텍처 분석 및 개선 제안 (2026-02-26)

## 1. 현 구조 분석 및 평가
현재 `library-search` 페이지는 Lit 기반의 웹 컴포넌트 아키텍처와 현대적인 성능 최적화 기법이 조화롭게 적용되어 있습니다.

### 핵심 강점
- **성능 최적화**: CSS `content-visibility: auto`를 활용하여 대량의 리스트 렌더링 성능을 확보함 (JS 기반 가상 스크롤의 복잡도 제거).
- **관심사 분리**: `Reactive Controller`(`StoreController`, `InfiniteScrollController`)를 통해 컴포넌트 로직과 부가 기능을 깔끔하게 분리함.
- **안정성**: `AbortController`를 통한 네트워크 요청 제어 및 `debounce` 처리가 충실히 구현됨.

---

## 2. 아키텍처 개선 방향

### 2.1. 상태 관리의 완전한 선언적 추상화
현재 `librarySearchStore`는 컴포넌트 내에서 수동으로 `subscribe`/`unsubscribe`를 관리하고 있습니다. 이를 `Reactive Controller` 패턴으로 통일하여 보일러플레이트를 제거하고 선언적 바인딩을 강화합니다.

### 2.2. 엄격한 단방향 데이터 흐름(Unidirectional Data Flow)
이벤트 위임 시 하위 컴포넌트의 속성을 직접 조작(`itemElement.selected = isChecked`)하는 명령형 코드를 제거해야 합니다. 오직 Model(`bookModel`)만 업데이트하고, 변경된 상태가 다시 아래로 흐르는(Top-down) 순수성을 확보합니다.

### 2.3. Shadow DOM 및 스타일 캡슐화 점진적 도입
현재는 전역 스타일 활용을 위해 Light DOM을 사용 중이나, 프로젝트 규모 확장 시 스타일 충돌 방지를 위해 `Shadow DOM`과 `Constructable Stylesheets` 도입을 검토합니다.

### 2.4. 시맨틱 마크업 및 접근성(a11y) 강화
리스트 구조를 시맨틱한 `<ul>`, `<li>` 구조로 명확히 하고, 커스텀 엘리먼트 자체에 `display: list-item` 또는 적절한 ARIA 역할을 부여하여 보조 공학 기기 지원을 강화합니다.

---

## 3. 결론
현재의 구현은 기술적 숙련도가 매우 높으며 실무적으로 견고합니다. 제안된 개선 사항은 컴포넌트 간 결합도를 낮추고 상태 예측 가능성을 높여 장기적인 유지보수 비용을 절감하는 데 목적이 있습니다.
