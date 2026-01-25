# 리팩토링 진행 상황

## 2026년 1월 25일 - 백엔드: 컨트롤러 레이어 도입 완료

### 1. 개요
기존 Express.js 백엔드에서 라우트 핸들러가 API 서비스 로직을 직접 호출하던 구조를, 컨트롤러 레이어를 도입하여 라우팅과 비즈니스 로직의 **관심사 분리(Separation of Concerns)**를 달성했습니다. 이는 코드의 모듈성과 유지보수성을 향상시키는 것을 목표로 합니다.

### 2. 변경 내용
*   **새 디렉토리 생성:** `server/src/controllers` 디렉토리를 생성했습니다.
*   **새 파일 생성:** `server/src/controllers/apiController.ts` 파일을 생성하여 각 API 서비스 함수를 감싸는 컨트롤러 함수들을 정의했습니다.
    *   예시: `fetchBooksFromNaver` 함수를 `apiController.ts` 내의 `searchNaverBook` 컨트롤러 함수가 호출하도록 변경.
*   **기존 파일 수정:** `server/src/routes/apiRoutes.ts` 파일을 수정하여, 기존에 `../apis`에서 직접 임포트하던 서비스 함수들 대신 `../controllers/apiController`에서 정의된 컨트롤러 함수들을 임포트하고 라우트 핸들러로 사용하도록 변경했습니다.

### 3. 기대 효과
*   **모듈성 향상:** 라우트 파일은 라우팅 역할만, 컨트롤러 파일은 요청 처리 및 서비스 호출 역할만 담당하게 되어 각 모듈의 책임이 명확해졌습니다.
*   **유지보수 용이성:** 특정 비즈니스 로직 변경 시 컨트롤러만 수정하면 되고, 라우팅 설정 변경 시 라우트 파일만 수정하면 됩니다.
*   **확장성:** 향후 컨트롤러 레이어에 요청 유효성 검사, 인증/인가 로직, 추가적인 데이터 가공 등을 쉽게 추가할 수 있는 기반이 마련되었습니다.

### 4. 변경된 파일 목록
*   `server/src/controllers/apiController.ts` (새로 생성)
*   `server/src/routes/apiRoutes.ts` (수정됨)

### 5. 확인 방법
1.  **서버 실행:** 프로젝트 루트에서 `npm run start-dev` 명령어를 실행하여 개발 서버를 시작합니다.
2.  **로그 확인:** 서버 시작 시 터미널에 오류 메시지가 없는지 확인합니다.
3.  **기능 테스트:** 웹 브라우저를 통해 애플리케이션의 도서 검색, 도서관 조회 등 기존 API를 사용하는 기능들이 정상적으로 작동하는지 확인합니다. 이 변경은 순수하게 내부 구조 개선이므로, 사용자에게 보이는 동작은 이전과 동일해야 합니다.

---

## 2026년 1월 25일 - 프론트엔드: 데이터 목록 컴포넌트 로직 추상화

### 1. 개요
`SearchResult`와 `Library` 컴포넌트에서 발견된 **데이터 요청, 로딩 상태 관리, 목록 렌더링**의 반복적인 패턴을 해결하기 위해, 공통 로직을 추상화한 `FetchListComponent` 기본 클래스를 도입했습니다.

### 2. 변경 내용
*   **새 기본 클래스 생성:** `app/src/scripts/components/FetchListComponent.ts` 파일을 생성했습니다. 이 클래스는 다음과 같은 공통 기능을 캡슐화합니다.
    *   로딩 인디케이터 표시/숨김
    *   `fetch` API 호출 및 `try...catch` 오류 처리
    *   결과 없음 / 에러 메시지 렌더링
    *   데이터를 받아 아이템 목록을 렌더링하는 추상화된 메서드 제공
*   **기존 컴포넌트 리팩토링:**
    *   `SearchResult.ts`와 `Library.ts`가 `FetchListComponent`를 상속받도록 수정했습니다.
    *   두 컴포넌트에서 중복되던 데이터 요청 및 렌더링 관련 코드를 제거하고, 기본 클래스의 메서드를 활용하도록 변경했습니다.
    *   각 컴포넌트에 특화된 로직(무한 스크롤, 즐겨찾기 정렬 등)은 해당 클래스에 남겨두거나, 기본 클래스의 메서드를 오버라이드하여 구현했습니다.
*   **HTML 수정:** `search.html`과 `library.html`의 목록 컨테이너 엘리먼트에 `data-list-container` 속성을 추가하여 기본 클래스가 컨테이너를 식별할 수 있도록 수정했습니다.

### 3. 기대 효과
*   **코드 중복 감소:** 여러 컴포넌트에 흩어져 있던 유사한 코드를 한 곳으로 통합하여 코드베이스를 크게 줄였습니다.
*   **유지보수성 향상:** 데이터 로딩 및 렌더링 방식에 대한 변경이 필요할 경우, `FetchListComponent`만 수정하면 되므로 유지보수가 용이해졌습니다.
*   **새로운 기능 개발 용이:** 앞으로 비슷한 목록형 컴포넌트를 개발할 때, `FetchListComponent`를 상속받아 핵심 로직만 구현하면 되므로 개발 속도가 향상됩니다.

### 4. 변경된 파일 목록
*   `app/src/scripts/components/FetchListComponent.ts` (새로 생성)
*   `app/src/scripts/pages/search/SearchResult.ts` (수정됨)
*   `app/src/scripts/pages/library/Library.ts` (수정됨)
*   `app/src/markup/search.html` (수정됨)
*   `app/src/markup/library.html` (수정됨)
*   `app/src/scripts/components/LoadingComponent.ts` (수정됨 - `export default`로 변경)

### 5. 확인 방법
1.  **빌드 확인:** `npx tsc --project ./tsconfig.json` 명령을 실행하여 타입스크립트 컴파일 오류가 없는지 확인합니다.
2.  **기능 테스트:**
    *   도서 검색 페이지에서 키워드로 검색 시, 무한 스크롤을 포함한 목록이 정상적으로 표시되는지 확인합니다.
    *   도서관 조회 페이지에서 지역을 선택했을 때, 즐겨찾는 도서관이 상단에 정렬되는 것을 포함하여 도서관 목록이 정상적으로 표시되는지 확인합니다.

---

## 2026년 1월 25일 - 프론트엔드: 아이템 컴포넌트 구조 표준화

### 1. 개요
`BookItem`과 `FavoriteItem` 등 아이템 단위 컴포넌트들의 템플릿 처리 방식이 비일관적인 문제를 해결하기 위해, 템플릿 복제 및 생명주기 관리를 표준화하는 `BaseItemComponent`를 도입했습니다.

### 2. 변경 내용
*   **새 기본 클래스 생성:** `app/src/scripts/components/BaseItemComponent.ts` 파일을 생성했습니다. 이 클래스는 생성자에서 `HTMLTemplateElement`를 받아, 컴포넌트가 DOM에 연결될 때(`connectedCallback`) 스스로 템플릿을 복제하여 내부에 추가하는 역할을 합니다.
*   **기존 아이템 컴포넌트 리팩토링:**
    *   `FavoriteItem.ts`와 `BookItem.ts`가 `BaseItemComponent`를 상속받도록 수정했습니다.
    *   컴포넌트 생성 및 초기화 로직을 `onMount`라는 새로운 생명주기 메서드로 옮겨, 템플릿이 추가된 후 안전하게 DOM 조작이 이루어지도록 보장했습니다.
*   **부모 컴포넌트 수정:**
    *   `Favorite.ts`가 `FavoriteItem`을 생성할 때, 템플릿을 직접 복제하여 주입하는 대신 생성자에 템플릿 엘리먼트를 전달하도록 수정했습니다. 이를 통해 `FavoriteItem`이 자신의 템플릿 처리를 완전히 책임지게 되었습니다.

### 3. 기대 효과
*   **컴포넌트 캡슐화 강화:** 각 아이템 컴포넌트가 자신의 뷰(템플릿)를 스스로 책임지게 되어 더욱 독립적이고 재사용하기 쉬운 부품이 되었습니다.
*   **코드 일관성 향상:** 아이템 컴포넌트의 생성 및 템플릿 처리 방식이 표준화되어 코드를 예측하고 이해하기 쉬워졌습니다.
*   **유지보수 용이성:** 컴포넌트의 템플릿 관련 로직이 한 곳(`BaseItemComponent`)에서 관리되므로, 향후 공통적인 수정이 필요할 때 용이합니다.

### 4. 변경된 파일 목록
*   `app/src/scripts/components/BaseItemComponent.ts` (새로 생성)
*   `app/src/scripts/pages/favorite/FavoriteItem.ts` (수정됨)
*   `app/src/scripts/pages/favorite/Favorite.ts` (수정됨)
*   `app/src/scripts/pages/search/BookItem.ts` (수정됨)

### 5. 확인 방법
1.  **빌드 확인:** `npx tsc --project ./tsconfig.json` 명령을 실행하여 타입스크립트 컴파일 오류가 없는지 확인합니다.
2.  **기능 테스트:**
    *   도서 검색 페이지에서 검색 결과 아이템들이 정상적으로 표시되는지 확인합니다.
    *   즐겨찾기 페이지에서 등록된 책 아이템들이 정상적으로 표시되는지 확인합니다.
