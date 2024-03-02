export default class BookDescription extends HTMLElement {
    protected el: HTMLElement | null;
    protected button: HTMLElement | null;

    constructor() {
        super();
        this.el = null;
        this.button = null;
    }

    set data(value: string) {
        this.render(value);
    }

    connectedCallback(): void {
        this.render(this.data);
    }

    disconnectedCallback(): void {
        if (this.button)
            this.button.removeEventListener(
                "click",
                this.onButtonClick.bind(this)
            );
    }

    protected render(value: string): void {
        const template = `
            <p class="description" data-ellipsis="true">${value}</p>
            <button type="button" class="more-description-button">설명 더보기</button>`;
        this.innerHTML = template;

        this.el = this.querySelector(".description");
        this.button = this.querySelector(".more-description-button");

        if (this.button)
            this.button.addEventListener(
                "click",
                this.onButtonClick.bind(this)
            );

        // if(this.isEllipsisActive(this.el)) {
        //     this.button.ariaHidden = false
        // }
    }

    // isEllipsisActive(el) {
    //     return (el.offsetHeight < el.scrollHeight);
    // }

    protected onButtonClick(): void {
        if (!this.el) return;

        switch (this.el.dataset.ellipsis) {
            case "true":
                this.el.dataset.ellipsis = "false";
                if (this.button) this.button.textContent = "설명 접기";
                break;
            case "false":
                this.el.dataset.ellipsis = "true";
                if (this.button) this.button.textContent = "설명 더보기";
                break;
        }
    }
}
