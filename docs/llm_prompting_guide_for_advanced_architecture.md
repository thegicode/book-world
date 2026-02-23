# 🤖 고급 아키텍처 설계를 위한 LLM 프롬프팅 가이드

이 문서는 `FavoriteNav.ts`에서 확립한 **최상위 레벨(Transcendent)** 아키텍처를 새로운 컴포넌트에 일관되게 적용하기 위한 LLM 프롬프트 전략을 담고 있습니다.

## 1. 핵심 아키텍처 원칙 (The Core Principles)

LLM에게 코드를 요청할 때 다음 5가지 원칙을 명시하십시오:

1. **관심사 분리 (Separation of Concerns)**: 모델 구독 및 이벤트 리스너 관리는 별도의 `Controller` 클래스로 격리한다.
2. **렌더링 배칭 (Rendering Batching)**: `requestAnimationFrame`을 사용하여 한 프레임에 단 한 번만 렌더링되도록 제어한다.
3. **메모리 최적화 (Memory Management)**: `WeakMap`을 사용하여 내부 상태를 관리하고, 컴포넌트 해제 시 리소스를 완벽히 정리한다.
4. **선언적 템플릿 (Declarative UI)**: `lit-html`을 사용하여 데이터 상태에 따른 직관적인 UI 구조를 유지한다.
5. **표준 준수 (Web Standards)**: 커스텀 이벤트, `observedAttributes` 등 브라우저 네이티브 API를 최대한 활용한다.

## 2. 권장 프롬프트 구조

### 🔹 [Persona] 전문가 페르소나 설정

> "너는 웹 표준과 성능 최적화에 정통한 **바닐라 JS 시니어 아키텍트**야. 프레임워크 없이 최상위 수준의 웹 컴포넌트를 설계해야 해."

### 🔹 [Context] 참조 코드 제공

> "새로 만들 컴포넌트의 구조는 첨부된 `FavoriteNav.ts`의 아키텍처를 모범 사례(Best Practice)로 삼아줘. 특히 `requestUpdate` 시스템과 `ModelController` 패턴을 그대로 유지해야 해."

### 🔹 [Specifics] 기술적 요구사항 나열

> - `lit-html` 기반의 선언적 렌더링 적용
> - `WeakMap`을 이용한 프라이빗 상태 은닉
> - 불필요한 리렌더링 방지를 위한 데이터 차분 비교(Diffing) 로직 포함
> - 키보드 접근성(A11y) 및 WAI-ARIA 준수

## 3. 실전 프롬프트 템플릿

```markdown
**대상**: [컴포넌트 이름, 예: BookDetail] 컴포넌트 구현

**요구사항**:

1. **아키텍처**: `FavoriteNav.ts`와 동일한 'Transcendent' 패턴을 사용하라.
    - `requestAnimationFrame` 기반의 `requestUpdate` 스케줄링.
    - `ModelController`를 통한 외부 모델(`bookModel`) 구독 격리.
    - `WeakMap` 기반의 내부 상태 보호 및 메모리 누수 방지.
2. **렌더링**: `lit-html`을 사용하고, 리스트 렌더링 시 `repeat` 디렉티브를 활용하라.
3. **상태**: URL 파라미터 및 모델 데이터의 변화에 반응형으로 동작해야 한다.
4. **성능**: 데이터가 실제로 변하지 않았다면 `render()` 호출을 차단하는 로직을 포함하라.
5. **품질**: TypeScript 타입을 엄격하게 적용하고, ESLint 경고(`no-unused-vars` 등)가 발생하지 않도록 정제하라.

위 조건에 부합하는 가장 우아하고 성능이 뛰어난 코드를 작성해줘.
```

## 4. 단계적 고도화 기법

LLM이 한 번에 완벽한 코드를 짜지 못할 경우 다음 순서로 리팩토링을 요청하십시오:

1. **Step 1**: "기본 기능과 HTML 구조를 `lit-html`로 먼저 짜줘."
2. **Step 2**: "성능 최적화를 위해 `requestAnimationFrame` 배칭 시스템을 적용해줘."
3. **Step 3**: "모델 구독 로직을 `ModelController`로 분리하고 `WeakMap`을 적용해서 메모리 관리를 강화해줘."
4. **Step 4**: "키보드 내비게이션과 WAI-ARIA 속성을 추가해서 접근성을 '전설' 레벨로 높여줘."

---

_이 가이드를 활용하면 일관된 고품질의 코드를 유지하며 프로젝트를 확장할 수 있습니다._
