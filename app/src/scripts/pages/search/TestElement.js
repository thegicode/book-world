export default class TestElement extends HTMLElement {
    constructor() {
        super();
        console.log(this);
    }

    get src() {
        return this.localName;
        // return this.getAttribute('src')
    }

    connectedCallback() {
        fetch(`./html/${this.src}.html`)
            .then((response) => response.text())
            .then((htmlStr) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlStr, "text/html");
                const element = doc.querySelector(".test-element");
                this.appendChild(element);
            });
    }

    disconnectedCallback() {
        //
    }
}
