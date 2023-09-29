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

export function cloneTemplate(template: HTMLTemplateElement) {
    const content = template.content.firstElementChild;
    if (!content) {
        throw new Error("Template content is empty");
    }
    return content.cloneNode(true) as HTMLElement;
}

export function fillElementsWithData<T>(data: T, container: HTMLElement) {
    Object.entries(data as Record<string, number>).forEach(([key, value]) => {
        const element = container.querySelector(`.${key}`) as HTMLElement;
        element.textContent = String(value);
    });
}
