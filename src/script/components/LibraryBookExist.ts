export default class LibraryBookExist extends HTMLElement {
  private root: Element;
  private itemTemplate: string;

  constructor() {
    super();
    this.root = this.querySelector(".library-list") as Element;
    this.itemTemplate = "";
  }

  connectedCallback(): void {
    this.itemTemplate = this.template();
  }

  async onLibraryBookExist(
    button: HTMLButtonElement | null,
    isbn13: string,
    library: Record<string, string>
  ): Promise<void> {
    const entries = Object.entries(library);
    this.loading(entries.length);
    if (button) {
      button.disabled = true;
    }

    const promises = entries.map(async ([libCode, libName], index) => {
      try {
        const response = await fetch(
          `/book-exist?isbn13=${isbn13}&libCode=${libCode}`
        );
        const data = await response.json();
        this.renderBookExist(data, libName, index);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    try {
      await Promise.all(promises);
      this.removeLoading();
    } catch (error) {
      console.error("Failed to fetch data for some libraries");
    }

    // Promise.all(promises)
    //     .then( () => {
    //         this.removeLoading()
    //     })
    //     .catch( () => {
    //         console.error('Failed to fetch data for some libraries')
    //     })
  }

  renderBookExist(
    data: { hasBook: string; loanAvailable: string },
    libName: string,
    index: number
  ): void {
    const { hasBook, loanAvailable } = data;
    const _hasBook: "소장, " | "미소장" = hasBook === "Y" ? "소장, " : "미소장";
    let _loanAvailable = "";
    if (hasBook === "Y") {
      _loanAvailable = loanAvailable === "Y" ? "대출가능" : "대출불가";
    }
    const el = this.querySelectorAll(".library-item")[index] as HTMLElement;

    const elName = el.querySelector(".name") as HTMLElement;
    if (elName) {
      elName.textContent = `☼ ${libName} : `;
    }
    const elHasBook = el.querySelector(".hasBook") as HTMLElement;
    if (elHasBook) {
      elHasBook.textContent = _hasBook;
    }
    const elLoanAvailable = el.querySelector(".loanAvailable") as HTMLElement;
    if (elLoanAvailable) {
      elLoanAvailable.textContent = _loanAvailable;
    }
  }

  loading(size: number): void {
    let tp = "";
    while (size > 0) {
      tp += this.itemTemplate;
      size--;
    }
    this.root.innerHTML = tp;
  }

  removeLoading(): void {
    const loadingItems = this.querySelectorAll(
      ".library-item[data-loading=true]"
    ) as NodeListOf<HTMLElement>;
    loadingItems.forEach((el) => {
      delete el.dataset.loading;
    });
  }

  template(): string {
    return `<li class="library-item" data-loading="true">
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`;
  }
}
