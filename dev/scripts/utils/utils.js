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
//# sourceMappingURL=utils.js.map