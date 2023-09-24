import { CustomEventEmitter } from "../../utils";
import { getCurrentDates } from "../../utils/utils";
export default class PopularHeader extends HTMLElement {
    constructor() {
        super();
        this.onClickFilterButton = () => {
            if (!this.form)
                return;
            this.form.hidden = !this.form.hidden;
        };
        this.closeForm = () => {
            if (!this.form)
                return;
            this.form.hidden = true;
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
                case "detailRegion":
                    this.handleDetailRegion(target);
                    break;
                case "addCode":
                    this.handleAddCode(target);
                    break;
                case "kdc":
                    this.handleSubject(target);
                    break;
                case "detailKdc":
                    this.handleDetailSubject(target);
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
            const params = {};
            const skipKeys = ["dataSource", "loanDuration", "subKdc", "subRegion"];
            params["pageNo"] = "1";
            for (const [key, value] of formData.entries()) {
                if (skipKeys.includes(key) || typeof value !== "string")
                    continue;
                const paramKey = key;
                if (value === "A") {
                    params[paramKey] = "";
                }
                else if (params[paramKey]) {
                    params[paramKey] += `;${value}`;
                }
                else {
                    params[paramKey] = value;
                }
            }
            CustomEventEmitter.dispatch("requestPopular", {
                params,
            });
            this.closeForm();
        };
        this.form = this.querySelector("form");
        this.filterButton = this.querySelector(".filterButton");
        this.closeButton = this.querySelector(".closeButton");
        this.startDateInput = this.querySelector("input[name='startDt']");
        this.endDateInput = this.querySelector("input[name='endDt']");
        this.detailRegion = this.querySelector("[name='detailRegion']");
        this.subRegion = this.querySelector(".subRegion");
        this.detailSubject = this.querySelector("[name='detailKdc']");
        this.subSubject = this.querySelector(".subSubject");
    }
    connectedCallback() {
        var _a, _b;
        if (!this.form)
            return;
        this.initialLoanDuration();
        (_a = this.filterButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickFilterButton);
        (_b = this.closeButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.closeForm);
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
        if (this.detailRegion && this.subRegion) {
            const isOnly = checkedEls.length === 1;
            this.detailRegion.disabled = !isOnly;
            if (this.detailRegion.checked) {
                this.subRegion.hidden = !isOnly;
            }
        }
    }
    handleDetailRegion(target) {
        if (!this.subRegion)
            return;
        this.subRegion.hidden = !target.checked;
    }
    handleAddCode(target) {
        if (!(target.value === "A")) {
            const elA = this.querySelector("input[name='addCode'][value='A']");
            elA.checked = false;
        }
        if (target.value === "A") {
            const els = this.querySelectorAll("input[type='checkbox'][name='addCode']");
            els.forEach((item) => (item.checked = false));
        }
    }
    handleSubject(target) {
        const elA = this.querySelector("input[name='kdc'][value='A']");
        const els = this.querySelectorAll("input[type='checkbox'][name='kdc']");
        if (!(target.value === "A")) {
            elA.checked = false;
        }
        if (target.value === "A") {
            els.forEach((item) => (item.checked = false));
        }
        const checkedEls = Array.from(this.querySelectorAll('[name="kdc"]:checked')).filter((el) => el.value !== "A");
        if (this.detailSubject && this.subSubject) {
            const isOnly = checkedEls.length === 1;
            this.detailSubject.disabled = !isOnly;
            if (this.detailSubject.checked) {
                this.subSubject.hidden = !isOnly;
            }
        }
    }
    handleDetailSubject(target) {
        if (!this.subSubject)
            return;
        this.subSubject.hidden = !target.checked;
    }
    handleLoanDuration(event) {
        var _a;
        if (!this.startDateInput || !this.endDateInput) {
            return;
        }
        const { currentDate, currentYear, currentMonth, currentDay } = getCurrentDates();
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
    initialLoanDuration() {
        if (!this.startDateInput || !this.endDateInput)
            return;
        const { currentDate, currentMonth, currentDay } = getCurrentDates();
        this.startDateInput.value = `${currentDate.getFullYear()}-01-01`;
        this.endDateInput.value = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;
    }
}
//# sourceMappingURL=PopularHeader.js.map