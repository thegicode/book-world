import { LitElement, html } from "lit";

export class ErrorFallback extends LitElement {
    static properties = {
        message: { type: String },
        showRetry: { type: Boolean },
    };

    message = "오류가 발생했습니다.";
    showRetry = true;

    createRenderRoot() {
        return this; // Keep light DOM
    }

    private handleRetry() {
        this.dispatchEvent(
            new CustomEvent("retry", {
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        return html`
            <div class="error-container" role="alert">
                <div class="error-message">${this.message}</div>
                ${this.showRetry
                    ? html`
                          <button
                              class="retry-button"
                              @click="${this.handleRetry}"
                              aria-label="다시 시도"
                          >
                              다시 시도
                          </button>
                      `
                    : ""}
            </div>
        `;
    }
}
