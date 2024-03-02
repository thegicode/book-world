export default class BookImage extends HTMLElement {
    private image: HTMLImageElement | null = null;

    constructor(url: string, name: string) {
        super();

        this.render(url, name);
    }

    // connectedCallback() {}

    render(url: string, name: string) {
        const imagge = document.createElement("img");
        imagge.className = "thumb";
        imagge.src = url;
        imagge.alt = name;

        imagge.onerror = this.onError.bind(this);

        this.image = imagge;

        this.appendChild(imagge);
    }

    onError() {
        this.dataset.fail = "true";
        console.error(`Failed to load image`);
        this.image?.remove();
    }
}
