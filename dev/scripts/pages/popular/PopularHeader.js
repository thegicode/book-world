export default class PopularHeader extends HTMLElement {
    constructor() {
        super();
        this.onClickFilterButton = () => {
            if (!this.form)
                return;
            this.form.hidden = !this.form.hidden;
        };
        this.onChange = (event) => {
            const target = event.target;
            switch (target.name) {
                case "loanDuration":
                    this.handleLoanDuration(event);
                    break;
                case "gender":
                    this.handleGender(target);
                    break;
                case "age":
                    this.handleAge(target);
                    break;
                case "region":
                    this.handleRegion(target);
                    break;
                case "region-detail":
                    this.handleRegionDetail(target);
                    break;
            }
        };
        this.onReset = () => {
            setTimeout(() => {
                this.initialLoanDuration();
            }, 100);
        };
        this.onSumbit = (event) => {
            event.preventDefault();
            if (!this.form)
                return;
            const formData = new FormData(this.form);
            for (const pair of formData.entries()) {
                console.log(pair[0] + ", " + pair[1]);
            }
        };
        this.form = this.querySelector("form");
        this.filterButton = this.querySelector(".filterButton");
        this.startDateInput = this.querySelector("input[name='startDate']");
        this.endDateInput = this.querySelector("input[name='endDate']");
        this.regionDetail = this.querySelector("[name='region-detail']");
        this.subRegion = this.querySelector(".subRegion");
    }
    connectedCallback() {
        var _a;
        if (!this.form)
            return;
        this.initialLoanDuration();
        (_a = this.filterButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickFilterButton);
        this.form.addEventListener("change", this.onChange);
        this.form.addEventListener("reset", this.onReset);
        this.form.addEventListener("submit", this.onSumbit);
    }
    disconnectedCallback() {
        var _a;
        if (!this.form)
            return;
        (_a = this.filterButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onClickFilterButton);
        this.form.removeEventListener("change", this.onChange);
        this.form.removeEventListener("reset", this.onReset);
        this.form.removeEventListener("submit", this.onSumbit);
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
    handleAge(target) {
        if (!(target.value === "A")) {
            const elA = this.querySelector("input[name='age'][value='A']");
            elA.checked = false;
        }
        if (target.value === "A") {
            const els = this.querySelectorAll("input[type='checkbox'][name='age']");
            els.forEach((item) => (item.checked = false));
        }
    }
    handleRegion(target) {
        const elA = this.querySelector("input[name='region'][value='A']");
        const els = this.querySelectorAll("input[type='checkbox'][name='region']");
        if (!(target.value === "A")) {
            elA.checked = false;
        }
        if (target.value === "A") {
            els.forEach((item) => (item.checked = false));
        }
        const checkedEls = Array.from(this.querySelectorAll('[name="region"]:checked')).filter((el) => el.value !== "A");
        if (this.regionDetail && this.subRegion) {
            const isOnly = checkedEls.length === 1;
            this.regionDetail.disabled = !isOnly;
            if (this.regionDetail.checked) {
                this.subRegion.hidden = !isOnly;
            }
        }
    }
    handleRegionDetail(target) {
        if (!this.subRegion)
            return;
        this.subRegion.hidden = !target.checked;
    }
    handleLoanDuration(event) {
        var _a;
        if (!this.startDateInput || !this.endDateInput) {
            return;
        }
        const { currentDate, currentYear, currentMonth, currentDay } = this.getCurrentDates();
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
}
//# sourceMappingURL=PopularHeader.js.map