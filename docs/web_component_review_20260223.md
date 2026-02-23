# 웹 컴포넌트 리뷰: 도서관 검색 페이지 (Library Search Page)
**작성일:** 2026-02-23
**범위:** `library-search` 페이지 컴포넌트 (`LibrarySearchKeyword`, `LibrarySearchStored`, `LibrarySearchItem`)

## 개요
이 문서는 `library-search` 페이지에 구현된 웹 컴포넌트의 아키텍처 패턴, 캡슐화 수준, 그리고 웹 표준 준수 여부를 분석합니다. 기능적으로는 안정적이나, 웹 컴포넌트 표준의 잠재력을 최대한 활용하여 재사용성과 유지보수성을 높일 수 있는 개선 방안을 제안합니다.

## 1. 컴포넌트 역할 및 관심사 분리 (Separation of Concerns) 🥇 [최우선]

### 현재 상태
- **캡슐화:** 기능 단위(`Search`, `Stored List`, `Item`)로 분리는 되어 있습니다.
- **`LibrarySearchKeyword`:** 현재 **데이터 페칭(API 호출)**, **무한 스크롤(Intersection Observer)**, **DOM 렌더링**, **이벤트 핸들링**까지 너무 많은 역할을 담당하는 "거대 컴포넌트(God Component)" 상태입니다.

### 개선 제안
- **UI와 로직 분리 (Container/Presentational 패턴 도입):**
  - 리스트 렌더링만을 전담하는 **`library-list` (또는 `search-result-list`)** 컴포넌트를 분리합니다.
  - `LibrarySearchKeyword`는 데이터를 조회하고 하위 컴포넌트에 주입하는 **컨테이너(Container)** 역할에 집중합니다.
- **`LibrarySearchStored` 의존성 제거:** 특정 페이지(`library-search`)의 스타일이나 로직에 종속되지 않도록 설계하여, 마이페이지 등 다른 곳에서도 재사용할 수 있도록 합니다.

## 2. 템플릿 최적화 (Template Optimization) 🥈

### 현재 상태
- **`BaseItemComponent`:** 템플릿 문자열을 `innerHTML`로 파싱하여 사용하고 있습니다. 이는 컴포넌트가 생성될 때마다 파싱 비용이 발생할 수 있습니다.

### 개선 제안
- **네이티브 `<template>` 요소 활용:** HTML 파일 내에 정적인 `<template>` 태그를 정의하고, 자바스크립트에서는 `node.cloneNode(true)`를 사용하여 복제하는 방식을 사용합니다. HTML 파싱을 최초 1회만 수행하므로 렌더링 성능이 향상됩니다.
- **경량 라이브러리 검토:** 복잡한 템플릿 관리가 필요하다면, 프레임워크의 오버헤드 없이 선언적 렌더링을 지원하는 **`lit-html`** 도입을 고려해볼 만합니다.

## 3. 속성-상태 동기화 (Attribute-Property Reflection) 🥉

### 현재 상태
- 데이터 흐름이 주로 메소드 호출이나 이벤트 버스(`bookModel`)에 의존하고 있습니다.
- HTML 속성(`attribute`)을 통해 컴포넌트의 상태를 제어하는 방식이 부족합니다.

### 개선 제안
- **Reflection 구현:** HTML 속성과 자바스크립트 프로퍼티를 동기화합니다.
  - 예: `<library-search-item selected>`라고 작성하면 자동으로 체크된 상태로 렌더링되도록 합니다.
- **`attributeChangedCallback` 활용:** 속성 변경을 즉시 감지하여 반응하도록 합니다. 이는 React, Vue 등 다른 프레임워크와의 상호운용성(Interoperability)을 높여줍니다.

## 4. 라이프사이클 관리 (Lifecycle Management)

### 현재 상태
- **Good:** `connectedCallback`과 `disconnectedCallback`을 통해 이벤트 리스너를 적절히 관리하여 메모리 누수를 방지하고 있습니다.

### 개선 제안
- **`adoptedCallback` 고려:** 드래그 앤 드롭 인터페이스 등 컴포넌트가 DOM 트리 내에서 이동하는 시나리오에 대비하여 `adoptedCallback` 구현을 고려합니다.

## 요약
현재 바닐라 JS 구현은 기능적으로 우수하며 클래스 기반 컴포넌트 구조를 잘 따르고 있습니다. 엔터프라이즈급 컴포넌트 라이브러리로 발전하기 위해 **역할 분리(Container/Presentational)**, **템플릿 최적화**, 그리고 **속성-상태 동기화** 순으로 리팩토링을 진행하는 것을 권장합니다.
