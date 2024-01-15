import { CustomEventEmitter } from "../../utils";
import { getCurrentDates } from "../../utils/helpers";

export default class PopularHeader extends HTMLElement {
    private form: HTMLFormElement;
    private filterButton: HTMLButtonElement;
    private closeButton: HTMLButtonElement;
    private startDateInput: HTMLInputElement;
    private endDateInput: HTMLInputElement;
    private detailRegion: HTMLInputElement;
    private subRegion: HTMLInputElement;
    private detailSubject: HTMLInputElement;
    private subSubject: HTMLInputElement;
    private pageNav: HTMLElement;
    private pageSize: number | null;

    constructor() {
        super();

        this.form = this.querySelector("form") as HTMLFormElement;
        this.filterButton = this.querySelector(
            ".filterButton"
        ) as HTMLButtonElement;
        this.closeButton = this.querySelector(
            ".closeButton"
        ) as HTMLButtonElement;
        this.startDateInput = this.querySelector(
            "input[name='startDt']"
        ) as HTMLInputElement;
        this.endDateInput = this.querySelector(
            "input[name='endDt']"
        ) as HTMLInputElement;
        this.detailRegion = this.querySelector(
            "[name='detailRegion']"
        ) as HTMLInputElement;
        this.subRegion = this.querySelector(".subRegion") as HTMLInputElement;
        this.detailSubject = this.querySelector(
            "[name='detailKdc']"
        ) as HTMLInputElement;
        this.subSubject = this.querySelector(".subSubject") as HTMLInputElement;
        this.pageNav = this.querySelector(".page-nav") as HTMLElement;
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

        CustomEventEmitter.add(
            "renderPageNav",
            this.onRenderPageNav as EventListener
        );
    }

    disconnectedCallback() {
        if (!this.form) return;

        this.filterButton.removeEventListener(
            "click",
            this.onClickFilterButton
        );
        this.form.removeEventListener("change", this.onChangeForm);
        this.form.removeEventListener("reset", this.onReset);
        this.form.removeEventListener("submit", this.onSumbit);
        CustomEventEmitter.remove(
            "renderPageNav",
            this.onRenderPageNav as EventListener
        );
    }

    private closeForm = () => {
        this.form.hidden = true;
    };

    private onRenderPageNav = (event: ICustomEvent<{ pageSize: number }>) => {
        this.pageSize = event.detail.pageSize;

        this.pageNav.innerHTML = "";

        const fragment = new DocumentFragment();
        const navSize = 3;
        for (let i = 0; i < navSize; i++) {
            const el = this.createNavItem(i) as HTMLButtonElement;
            fragment.appendChild(el);
        }

        this.pageNav.appendChild(fragment);
        this.pageNav.hidden = false;

        this.insertBefore(this.pageNav, this.filterButton);
    };

    private createNavItem(index: number) {
        if (!this.pageSize) return;

        const el = document.createElement("button");
        el.type = "button";
        el.value = index.toString();
        el.textContent = `${this.pageSize * index + 1} ~ ${
            this.pageSize * (index + 1)
        }`;

        if (index === 0) el.ariaSelected = "true";

        el.addEventListener("click", this.onClickPageNav);
        return el;
    }

    private onClickPageNav = (event: Event) => {
        const target = event.target as HTMLButtonElement;
        if (!target || !this.pageNav) return;

        const targeted = this.pageNav.querySelector("[aria-selected=true]");
        if (targeted) {
            targeted.ariaSelected = "false";
        }
        target.ariaSelected = "true";

        if (this.pageNav.lastChild === target) {
            const el = this.createNavItem(
                Number(target.value) + 1
            ) as HTMLButtonElement;
            this.pageNav.appendChild(el);
        }

        CustomEventEmitter.dispatch("clickPageNav", {
            pageIndex: Number(target.value) + 1,
        });
    };

    private onClickFilterButton = () => {
        this.form.hidden = !this.form.hidden;
    };

    private onChangeForm = (event: Event) => {
        const target = event.target as HTMLInputElement;

        const actions: Record<string, () => void> = {
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

    private handleDataSource(target: HTMLInputElement) {
        console.log(target.value);
    }

    private handleGender(target: HTMLInputElement) {
        if (!(target.value === "A")) {
            const element = this.querySelector(
                "input[name='gender'][value='A']"
            ) as HTMLInputElement;
            element.checked = false;
        }

        if (target.value === "A") {
            const elements = this.querySelectorAll<HTMLInputElement>(
                "input[type='checkbox'][name='gender']"
            );
            elements.forEach((item) => (item.checked = false));
        }
    }

    private handleAge(target: HTMLInputElement) {
        if (!(target.value === "A")) {
            const element = this.querySelector(
                "input[name='age'][value='A']"
            ) as HTMLInputElement;

            element.checked = false;
        }

        if (target.value === "A") {
            const elements = this.querySelectorAll<HTMLInputElement>(
                "input[type='checkbox'][name='age']"
            );

            elements.forEach((item) => (item.checked = false));
        }
    }

    private handleRegion(target: HTMLInputElement) {
        const element = this.querySelector(
            "input[name='region'][value='A']"
        ) as HTMLInputElement;

        const elements = this.querySelectorAll<HTMLInputElement>(
            "input[type='checkbox'][name='region']"
        );

        if (!(target.value === "A")) {
            element.checked = false;
        }

        if (target.value === "A") {
            elements.forEach((item) => (item.checked = false));
        }

        const checkedEls = Array.from(
            this.querySelectorAll<HTMLInputElement>('[name="region"]:checked')
        ).filter((el) => el.value !== "A");

        if (this.detailRegion && this.subRegion) {
            const isOnly = checkedEls.length === 1;
            this.detailRegion.disabled = !isOnly;
            if (this.detailRegion.checked) {
                this.subRegion.hidden = !isOnly;
            }
        }
    }

    private handleDetailRegion(target: HTMLInputElement) {
        this.subRegion.hidden = !target.checked;
    }

    private handleAddCode(target: HTMLInputElement) {
        if (!(target.value === "A")) {
            const elA = this.querySelector(
                "input[name='addCode'][value='A']"
            ) as HTMLInputElement;

            elA.checked = false;
        }

        if (target.value === "A") {
            const els = this.querySelectorAll<HTMLInputElement>(
                "input[type='checkbox'][name='addCode']"
            );

            els.forEach((item) => (item.checked = false));
        }
    }

    private handleSubject(target: HTMLInputElement) {
        const elA = this.querySelector(
            "input[name='kdc'][value='A']"
        ) as HTMLInputElement;

        const els = this.querySelectorAll<HTMLInputElement>(
            "input[type='checkbox'][name='kdc']"
        );

        if (!(target.value === "A")) {
            elA.checked = false;
        }

        if (target.value === "A") {
            els.forEach((item) => (item.checked = false));
        }

        const checkedEls = Array.from(
            this.querySelectorAll<HTMLInputElement>('[name="kdc"]:checked')
        ).filter((el) => el.value !== "A");

        if (this.detailSubject && this.subSubject) {
            const isOnly = checkedEls.length === 1;
            this.detailSubject.disabled = !isOnly;
            if (this.detailSubject.checked) {
                this.subSubject.hidden = !isOnly;
            }
        }
    }

    private handleDetailSubject(target: HTMLInputElement) {
        if (!this.subSubject) return;
        this.subSubject.hidden = !target.checked;
    }

    private handleLoanDuration(event?: Event) {
        const { currentDate, currentYear, currentMonth, currentDay } =
            getCurrentDates();

        const target = event?.target as HTMLInputElement;

        switch (target?.value) {
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
                startOfWeek.setDate(
                    currentDate.getDate() - currentDate.getDay()
                );
                const startWeekYear = startOfWeek.getFullYear();
                const startWeekMonth = String(
                    startOfWeek.getMonth() + 1
                ).padStart(2, "0");
                const startWeekDay = String(startOfWeek.getDate()).padStart(
                    2,
                    "0"
                );
                this.startDateInput.value = `${startWeekYear}-${startWeekMonth}-${startWeekDay}`;
                this.endDateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
                break;
            }
            case "custom":
                break;
        }

        this.querySelector(".dateRange")?.addEventListener("click", () => {
            const customDateInput = this.querySelector(
                "input[name='loanDuration'][value='custom']"
            ) as HTMLInputElement;
            customDateInput.checked = true;
        });
    }

    private initialLoanDuration() {
        const { currentDate, currentMonth, currentDay } = getCurrentDates();

        this.startDateInput.value = `${currentDate.getFullYear()}-01-01`;
        this.endDateInput.value = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;
    }

    onReset = () => {
        setTimeout(() => {
            this.initialLoanDuration();
        }, 100);
    };

    private onSumbit = (event: Event) => {
        event.preventDefault();

        const formData = new FormData(this.form);

        const params: Partial<IPopularFetchParams> = {};
        const skipKeys = ["dataSource", "loanDuration", "subKdc", "subRegion"];
        params["pageNo"] = "1";

        for (const [key, value] of formData.entries()) {
            if (skipKeys.includes(key) || typeof value !== "string") continue;

            const paramKey = key as keyof IPopularFetchParams;

            if (value === "A") {
                params[paramKey] = "";
            } else if (params[paramKey]) {
                params[paramKey] += `;${value}`;
            } else {
                params[paramKey] = value;
            }
        }

        CustomEventEmitter.dispatch("requestPopular", {
            params,
        });

        this.closeForm();
    };
}
