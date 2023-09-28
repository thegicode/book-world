export default class BookImage extends HTMLElement {
    private imgElement: HTMLImageElement;
    private imgContainer: HTMLDivElement;

    constructor() {
        super();

        this.imgElement = document.createElement("img");
        this.imgElement.className = "thumb";

        this.imgContainer = document.createElement("div");
        this.imgContainer.className = "book-image";

        this.imgElement.onerror = this.handleImageError.bind(this);
    }

    // 즐겨찾기, 상세
    set data(objectData: IBookImageData) {
        const jsonData = JSON.stringify(objectData);

        if (this.dataset.object !== jsonData) {
            this.dataset.object = jsonData;
            this.render();
        }
    }

    connectedCallback() {
        if (!this.imgElement.src && this.dataset.object) {
            this.render();
        }
    }

    // search : dataset
    private render() {
        const data: IBookImageData | null = this.dataset.object
            ? JSON.parse(this.dataset.object)
            : null;

        if (data && "bookImageURL" in data && "bookname" in data) {
            const { bookImageURL, bookname } = data;
            this.imgElement.src = bookImageURL;
            this.imgElement.alt = bookname;

            this.imgContainer.appendChild(this.imgElement);
            this.appendChild(this.imgContainer);
        }
    }

    private handleImageError() {
        this.dataset.fail = "true";
        console.error(`Failed to load image: ${this.imgElement.src}`);
        this.imgElement.remove();
        if (!this.imgContainer.hasChildNodes()) {
            this.imgContainer.remove(); // 컨테이너 제거 처리 추가
        }
    }
}
