import { getCurrentDates } from "@/utils/helpers";

export default class PopularSearch extends HTMLElement {
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

        this.onClickPageNav = this.onClickPageNav.bind(this);
    }

    connectedCallback() {
        this.initialLoanDuration();

        this.filterButton.addEventListener("click", this.onClickFilterButton);
        this.closeButton.addEventListener("click", this.closeForm);
        this.form.addEventListener("change", this.onChangeForm);
        this.form.addEventListener("reset", this.onReset);
        this.form.addEventListener("submit", this.onSubmit);

        this.querySelector(".dateRange")?.addEventListener("click", this.onClickDateRange);
    }

    disconnectedCallback() {
        if (!this.form) return;

        this.filterButton.removeEventListener(
            "click",
            this.onClickFilterButton
        );
        this.form.removeEventListener("change", this.onChangeForm);
        this.form.removeEventListener("reset", this.onReset);
        this.form.removeEventListener("submit", this.onSubmit);
        this.querySelector(".dateRange")?.removeEventListener("click", this.onClickDateRange);
    }

    private closeForm = () => {
        this.form.hidden = true;
    };

    public renderPageNav(pageSize: number) {
        this.pageSize = pageSize;

        this.cleanupPageNav();
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
    }

    private createNavItem(index: number) {
        if (!this.pageSize) return;

        const el = document.createElement("button");
        el.type = "button";
        el.value = index.toString();
        el.textContent = `${this.pageSize * index + 1} ~ ${
            this.pageSize * (index + 1)
        }`;

        if (index === 0) el.ariaCurrent = "page";

        el.addEventListener("click", this.onClickPageNav);
        return el;
    }

    private onClickPageNav = (event: Event) => {
        const target = event.target as HTMLButtonElement;
        if (!target || !this.pageNav) return;

        const targeted = this.pageNav.querySelector("[aria-current]");
        if (targeted) {
            targeted.removeAttribute("aria-current");
        }
        target.ariaCurrent = "page";

        if (this.pageNav.lastChild === target) {
            const el = this.createNavItem(
                Number(target.value) + 1
            ) as HTMLButtonElement;
            this.pageNav.appendChild(el);
        }

        this.dispatchEvent(new CustomEvent("click-page-nav", {
            bubbles: true,
            detail: { pageIndex: Number(target.value) + 1 },
        }));
    };

    private cleanupPageNav() {
        this.pageNav.querySelectorAll("button").forEach((btn) => {
            btn.removeEventListener("click", this.onClickPageNav);
        });
    }

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
            loanDuration: () => this.handleLoanDuration(target),
            kdc: () => this.handleSubject(target),
            region: () => this.handleRegion(target),
        };

        if (target.name) {
            actions[target.name]();
        }
    };

    private handleDataSource(target: HTMLInputElement) {
        const durationInputs = this.querySelectorAll<HTMLInputElement>(
            "input[name='loanDuration']"
        );
        if (!durationInputs.length) return;

        const setDuration = (value: string) => {
            const durationInput = this.querySelector(
                `input[name='loanDuration'][value='${value}']`
            ) as HTMLInputElement | null;
            if (!durationInput) return;

            durationInput.checked = true;
            this.handleLoanDuration(durationInput);
        };

        if (target.value === "M") {
            durationInputs.forEach((input) => {
                input.disabled = input.value !== "month";
            });
            setDuration("month");
            return;
        }

        if (target.value === "Y") {
            durationInputs.forEach((input) => {
                input.disabled = input.value !== "year";
            });
            setDuration("year");
            return;
        }

        durationInputs.forEach((input) => {
            input.disabled = false;
        });
    }

    /**
     * "전체(A)" 체크박스와 개별 체크박스의 상호 배타적 토글을 처리한다.
     * - "A" 선택 시: 나머지 체크박스 전부 해제
     * - 개별 선택 시: "A" 체크박스 해제
     */
    private toggleAllCheckbox(name: string, target: HTMLInputElement) {
        if (target.value !== "A") {
            const allCheckbox = this.querySelector(
                `input[name='${name}'][value='A']`
            ) as HTMLInputElement | null;
            if (allCheckbox) allCheckbox.checked = false;
        } else {
            this.querySelectorAll<HTMLInputElement>(
                `input[type='checkbox'][name='${name}']`
            ).forEach((item) => (item.checked = false));
        }
    }

    private handleGender(target: HTMLInputElement) {
        this.toggleAllCheckbox('gender', target);
    }

    private handleAge(target: HTMLInputElement) {
        this.toggleAllCheckbox('age', target);
    }

    /**
     * 체크된 항목이 정확히 1개일 때만 세부 옵션(detail checkbox + sub section)을 활성화한다.
     */
    private updateDetailToggle(
        name: string,
        detailEl: HTMLInputElement,
        subEl: HTMLInputElement
    ) {
        const checkedCount = this.querySelectorAll<HTMLInputElement>(
            `[name="${name}"]:checked:not([value="A"])`
        ).length;
        const isOnly = checkedCount === 1;

        detailEl.disabled = !isOnly;
        if (detailEl.checked) {
            subEl.hidden = !isOnly;
        }
    }

    private handleRegion(target: HTMLInputElement) {
        this.toggleAllCheckbox('region', target);
        if (this.detailRegion && this.subRegion) {
            this.updateDetailToggle('region', this.detailRegion, this.subRegion);
        }
    }

    private handleDetailRegion(target: HTMLInputElement) {
        this.subRegion.hidden = !target.checked;
    }

    private handleAddCode(target: HTMLInputElement) {
        this.toggleAllCheckbox('addCode', target);
    }

    private handleSubject(target: HTMLInputElement) {
        this.toggleAllCheckbox('kdc', target);
        if (this.detailSubject && this.subSubject) {
            this.updateDetailToggle('kdc', this.detailSubject, this.subSubject);
        }
    }

    private handleDetailSubject(target: HTMLInputElement) {
        if (!this.subSubject) return;
        this.subSubject.hidden = !target.checked;
    }

    private handleLoanDuration(target?: HTMLInputElement) {
        const { currentDate, currentYear, currentMonth, currentDay } =
            getCurrentDates();

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
    }

    private onClickDateRange = () => {
        const customDateInput = this.querySelector(
            "input[name='loanDuration'][value='custom']"
        ) as HTMLInputElement;
        if (customDateInput) customDateInput.checked = true;
    };

    private initialLoanDuration() {
        const { currentDate, currentMonth, currentDay } = getCurrentDates();

        this.startDateInput.value = `${currentDate.getFullYear()}-01-01`;
        this.endDateInput.value = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;
    }

    private onReset = () => {
        setTimeout(() => {
            this.initialLoanDuration();
        }, 100);
    };

    private onSubmit = (event: Event) => {
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

        this.dispatchEvent(new CustomEvent("request-popular", {
            bubbles: true,
            detail: { params },
        }));

        this.closeForm();
    };
}
