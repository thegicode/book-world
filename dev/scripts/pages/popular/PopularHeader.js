import { CustomEventEmitter } from "../../utils";
import { getCurrentDates } from "../../utils/helpers";
export default class PopularHeader extends HTMLElement {
    constructor() {
        super();
        this.closeForm = () => {
            this.form.hidden = true;
        };
        this.onRenderPageNav = (event) => {
            this.pageSize = event.detail.pageSize;
            this.pageNav.innerHTML = "";
            const fragment = new DocumentFragment();
            const navSize = 3;
            for (let i = 0; i < navSize; i++) {
                const el = this.createNavItem(i);
                fragment.appendChild(el);
            }
            this.pageNav.appendChild(fragment);
            this.pageNav.hidden = false;
            this.insertBefore(this.pageNav, this.filterButton);
        };
        this.onClickPageNav = (event) => {
            const target = event.target;
            if (!target || !this.pageNav)
                return;
            const targeted = this.pageNav.querySelector("[aria-selected=true]");
            if (targeted) {
                targeted.ariaSelected = "false";
            }
            target.ariaSelected = "true";
            if (this.pageNav.lastChild === target) {
                const el = this.createNavItem(Number(target.value) + 1);
                this.pageNav.appendChild(el);
            }
            CustomEventEmitter.dispatch("clickPageNav", {
                pageIndex: Number(target.value) + 1,
            });
        };
        this.onClickFilterButton = () => {
            this.form.hidden = !this.form.hidden;
        };
        this.onChangeForm = (event) => {
            const target = event.target;
            const actions = {
                addCode: () => this.handleAddCode(target),
                age: () => this.handleAge(target),
                dataSource: () => this.handleDataSource(target),
                detailKdc: () => this.handleDetailSubject(target),
                detailRegion: () => this.handleDetailRegion(target),
                gender: () => this.handleGender(target),
                loanDuration: () => this.handleLoanDuration(event),
                kdc: () => this.handleSubject(target),
                region: () => this.handleRegion(target),
            };
            if (target.name) {
                actions[target.name]();
            }
        };
        this.onReset = () => {
            setTimeout(() => {
                this.initialLoanDuration();
            }, 100);
        };
        this.onSumbit = (event) => {
            event.preventDefault();
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
        this.pageNav = this.querySelector(".page-nav");
        this.pageSize = null;
        this.onRenderPageNav = this.onRenderPageNav.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
    }
    connectedCallback() {
        this.initialLoanDuration();
        this.filterButton.addEventListener("click", this.onClickFilterButton);
        this.closeButton.addEventListener("click", this.closeForm);
        this.form.addEventListener("change", this.onChangeForm);
        this.form.addEventListener("reset", this.onReset);
        this.form.addEventListener("submit", this.onSumbit);
        CustomEventEmitter.add("renderPageNav", this.onRenderPageNav);
    }
    disconnectedCallback() {
        if (!this.form)
            return;
        this.filterButton.removeEventListener("click", this.onClickFilterButton);
        this.form.removeEventListener("change", this.onChangeForm);
        this.form.removeEventListener("reset", this.onReset);
        this.form.removeEventListener("submit", this.onSumbit);
        CustomEventEmitter.remove("renderPageNav", this.onRenderPageNav);
    }
    createNavItem(index) {
        if (!this.pageSize)
            return;
        const el = document.createElement("button");
        el.type = "button";
        el.value = index.toString();
        el.textContent = `${this.pageSize * index + 1} ~ ${this.pageSize * (index + 1)}`;
        if (index === 0)
            el.ariaSelected = "true";
        el.addEventListener("click", this.onClickPageNav);
        return el;
    }
    handleDataSource(target) {
        console.log(target.value);
    }
    handleGender(target) {
        if (!(target.value === "A")) {
            const element = this.querySelector("input[name='gender'][value='A']");
            element.checked = false;
        }
        if (target.value === "A") {
            const elements = this.querySelectorAll("input[type='checkbox'][name='gender']");
            elements.forEach((item) => (item.checked = false));
        }
    }
    handleAge(target) {
        if (!(target.value === "A")) {
            const element = this.querySelector("input[name='age'][value='A']");
            element.checked = false;
        }
        if (target.value === "A") {
            const elements = this.querySelectorAll("input[type='checkbox'][name='age']");
            elements.forEach((item) => (item.checked = false));
        }
    }
    handleRegion(target) {
        const element = this.querySelector("input[name='region'][value='A']");
        const elements = this.querySelectorAll("input[type='checkbox'][name='region']");
        if (!(target.value === "A")) {
            element.checked = false;
        }
        if (target.value === "A") {
            elements.forEach((item) => (item.checked = false));
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
        const { currentDate, currentMonth, currentDay } = getCurrentDates();
        this.startDateInput.value = `${currentDate.getFullYear()}-01-01`;
        this.endDateInput.value = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;
    }
}
//# sourceMappingURL=PopularHeader.js.map