import { CustomEventEmitter } from '../../utils/index.js';
export default class InputSearch extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        this.input = this.querySelector('input');
    }
    connectedCallback() {
        this.form.addEventListener('submit', this.onSubmit.bind(this));
    }
    disconnectedCallback() {
        this.form.removeEventListener('submit', this.onSubmit);
    }
    onSubmit(event) {
        event.preventDefault();
        const keyword = this.input.value;
        if (!keyword)
            return;
        this.input.value = '';
        const url = new URL(window.location.href);
        url.searchParams.set('keyword', keyword);
        window.history.pushState({}, "", url);
        CustomEventEmitter.dispatch('search-page-init', { keyword });
        this.input.focus();
    }
}
//# sourceMappingURL=InputSearch.js.map