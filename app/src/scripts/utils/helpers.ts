export function getCurrentDates() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentDay = String(currentDate.getDate()).padStart(2, "0");

    return {
        currentDate,
        currentYear,
        currentMonth,
        currentDay,
    };
}

export function cloneTemplate<T extends HTMLElement>(
    template: HTMLTemplateElement
) {
    const content = template.content.firstElementChild;
    if (!content) {
        throw new Error("Template content is empty");
    }
    return content.cloneNode(true) as T;
}

export function fillElementsWithData<T>(data: T, container: HTMLElement) {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
        const element = container.querySelector(`.${key}`) as HTMLElement;
        if (element) {
            element.textContent = String(value);
        }
    });
}

/**
 * 프로그래밍 방식으로 특정 요소에 포커스를 맞춥니다.
 * 이 함수는 키보드나 스크린 리더 사용자가 동적으로 변경된 콘텐츠를
 * 쉽게 인지할 수 있도록 돕습니다.
 * @param container 포커스를 맞출 요소를 포함하는 컨테이너
 * @param selector 포커스를 맞출 대상 요소의 CSS 선택자 (기본값: 'h1')
 */
export function manageFocus(container: HTMLElement, selector: string = 'h1') {
    const targetElement = container.querySelector<HTMLElement>(selector);

    if (targetElement) {
        // 원래 포커스 불가능한 요소(div, h1 등)에 포커스를 주기 위해 tabindex 설정
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();

        // 포커스를 잃으면 다시 tabindex를 제거하여 DOM을 원래 상태로 유지
        targetElement.addEventListener('blur', () => {
            targetElement.removeAttribute('tabindex');
        }, { once: true });
    }
}
