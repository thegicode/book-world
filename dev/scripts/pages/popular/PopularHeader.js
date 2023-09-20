export default class PopularHeader extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector("form");
        this.startDateInput = this.querySelector("input[name='startDate']");
        this.endDateInput = this.querySelector("input[name='endDate']");
    }
    connectedCallback() {
        if (!this.form)
            return;
        this.handleLoanDuration();
        this.form.addEventListener("change", (event) => {
            this.handleChange(event);
        });
        this.form.addEventListener("submit", (event) => this.handleSumbit(event));
        this.form.addEventListener("reset", () => this.handleReset());
    }
    handleChange(event) {
        const target = event.target;
        switch (target.name) {
            case "loanDuration":
                this.handleLoanDuration(event);
                break;
            case "gender":
                this.handleGender(target);
                break;
        }
    }
    handleGender(target) {
        if (!(target.value === "A")) {
            const elA = this.querySelector("input[name='gender'][value='A']");
            elA.checked = false;
        }
        if (target.value === "A") {
            const els = this.querySelectorAll("input[type='checkbox'][name='gender']");
            els.forEach((item) => (item.checked = false));
        }
    }
    handleLoanDuration(event) {
        var _a;
        if (!this.startDateInput || !this.endDateInput) {
            return;
        }
        const { currentDate, currentYear, currentMonth, currentDay } = this.getCurrentDates();
        if (!event) {
            this.initialLoanDuration();
        }
        else {
            const target = event === null || event === void 0 ? void 0 : event.target;
            switch (target === null || target === void 0 ? void 0 : target.value) {
                case "year":
                    this.initialLoanDuration();
                    break;
                case "month": {
                    this.startDateInput.value = `${currentYear}-${currentMonth}-01`;
                    this.endDateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
                    break;
                }
                case "week": {
                    const startOfWeek = new Date(currentDate);
                    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                    const startWeekYear = startOfWeek.getFullYear();
                    const startWeekMonth = String(startOfWeek.getMonth() + 1).padStart(2, "0");
                    const startWeekDay = String(startOfWeek.getDate()).padStart(2, "0");
                    this.startDateInput.value = `${startWeekYear}-${startWeekMonth}-${startWeekDay}`;
                    this.endDateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
                    break;
                }
                case "custom":
                    break;
            }
        }
        (_a = this.querySelector(".dateRange")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            const customDateInput = this.querySelector("input[name='loanDuration'][value='custom']");
            customDateInput.checked = true;
        });
    }
    getCurrentDates() {
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
    initialLoanDuration() {
        if (!this.startDateInput || !this.endDateInput)
            return;
        const { currentDate, currentMonth, currentDay } = this.getCurrentDates();
        this.startDateInput.value = `${currentDate.getFullYear()}-01-01`;
        this.endDateInput.value = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;
    }
    handleReset() {
        setTimeout(() => {
            this.initialLoanDuration();
        }, 100);
    }
    handleSumbit(event) {
        event.preventDefault();
        if (!this.form)
            return;
        const formData = new FormData(this.form);
        for (const pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
    }
}
//# sourceMappingURL=PopularHeader.js.map