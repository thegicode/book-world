export default class BookImage extends HTMLElement {
  private bookData: { bookImageURL: string; bookname: string } | null;

  constructor() {
    super();
    this.bookData = null;
  }

  // 즐겨찾기, 상세
  set data(objectData: { bookImageURL: string; bookname: string }) {
    this.bookData = objectData;
    if (!this.querySelector("img")) {
      this.render();
    } else {
      // this.onSetThumb(objectData)
      this.handleError();
    }
  }

  connectedCallback(): void {
    this.render();
  }

  // searc : dataset
  private render(): void {
    const data =
      this.bookData || (this.dataset.object && JSON.parse(this.dataset.object));

    const { bookImageURL, bookname } = data;

    let imageSrc = "";
    let imageAlt = "";
    if (data) {
      imageSrc = bookImageURL;
      imageAlt = bookname;
    }

    this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`;

    if (this.querySelector("img")) {
      this.handleError();
    }
  }

  private onSetThumb({
    bookImageURL,
    bookname,
  }: {
    bookImageURL: string;
    bookname: string;
  }): void {
    const imgElement = this.querySelector("img");
    if (imgElement) {
      imgElement.src = `${bookImageURL}`;
      imgElement.alt = bookname;
    }
  }

  handleError(): void {
    const imgElement = this.querySelector("img");
    if (imgElement) {
      imgElement.onerror = () => {
        this.dataset.fail = "true";
        imgElement.remove();
      };
    }
  }
}
