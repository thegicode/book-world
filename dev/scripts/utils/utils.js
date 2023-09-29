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
export function cloneTemplate(template) {
    const content = template.content.firstElementChild;
    if (!content) {
        throw new Error("Template content is empty");
    }
    return content.cloneNode(true);
}
export function fillElementsWithData(data, container) {
    Object.entries(data).forEach(([key, value]) => {
        const element = container.querySelector(`.${key}`);
        element.textContent = String(value);
    });
}
//# sourceMappingURL=utils.js.map