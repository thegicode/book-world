import { html, render } from "lit";

export default class LoadingComponent extends HTMLElement {
    private isLoading = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    show() {
        this.isLoading = true;
        this.render();
    }

    hide() {
        this.isLoading = false;
        this.render();
    }

    private render() {
        // 1. 컴포넌트 자체(Host)의 속성을 데이터 상태와 동기화
        this.toggleAttribute("hidden", !this.isLoading);

        // 2. 내부 마크업 렌더링
        const template = html`
            <div class="loading-overlay">
                <div class="loader"></div>
                <p>Loading...</p>
            </div>
        `;
        render(template, this);
    }
}

if (!customElements.get("loading-component")) {
    customElements.define("loading-component", LoadingComponent);
}
