import { CustomFetch } from '../../utils/index.js'
import { state } from '../../modules/model.js'
import { BookDescription, BookImage, LibraryBookExist } from '../../components/index.js'

interface BookData {
    authors: string,
    bookImageURL: string,
    bookname: string,
    class_nm: string,
    description: string,
    isbn13: string,
    loanCnt: string,
    publication_year: string,
    publisher: string
}

interface UsageAnalysisData {
    book : BookData
}

export default class FavoriteItem extends HTMLElement {

    private libraryButton: HTMLButtonElement
    private link: HTMLElement
    private linkData: { book: BookData } | undefined;


    constructor() {
        super()
        this.libraryButton = this.querySelector('.library-button') as HTMLButtonElement
        
        this.link = this.querySelector('a') as HTMLElement
    }

    connectedCallback() {
        this.loading()
        this.fetchData(this.dataset.isbn as string)
        this.libraryButton.addEventListener('click', this.onLibrary.bind(this))
        this.link.addEventListener('click', this.onClick.bind(this))
    }

    disconnectedCallback() {
        this.libraryButton.removeEventListener('click', this.onLibrary)
        this.link.removeEventListener('click', this.onClick)
    }

    async fetchData(isbn: string) {
        const url = `/usage-analysis-list?isbn13=${isbn}`
        try {
            const data = await CustomFetch.fetch<UsageAnalysisData>(url)
            this.render(data)
        } catch(error) {
            this.errorRender()
            console.error(error)
            throw new Error(`Fail to get usage analysis list.`)
        }
    }

    render(data: {book : BookData}) {
        const { 
            book, 
            // loanHistory,
            // loanGrps,
            // keywords,
            // recBooks,
            // coLoanBooks
        } = data

        const {
            authors,
            bookImageURL,
            bookname,
            class_nm,
            // class_no,
            description,
            isbn13,
            loanCnt,
            publication_year,
            publisher,
            // vol
        } = book

        this.linkData = data;

        (this.querySelector('.bookname') as HTMLElement).textContent = bookname;
        (this.querySelector('.authors') as HTMLElement).textContent = authors;
        (this.querySelector('.class_nm') as HTMLElement).textContent = class_nm;
        (this.querySelector('.isbn13') as HTMLElement).textContent = isbn13;
        (this.querySelector('.loanCnt') as HTMLElement).textContent = loanCnt.toLocaleString();
        (this.querySelector('.publication_year') as HTMLElement).textContent = publication_year;
        (this.querySelector('.publisher') as HTMLElement).textContent = publisher;
        const descriptionElement = this.querySelector<BookDescription>('book-description')
        if (descriptionElement) {
            descriptionElement.data = description;
        }
        const imageElement = this.querySelector<BookImage>('book-image')
        if (imageElement) {
            imageElement.data = {
                bookImageURL,
                bookname
            }
        }
        this.removeLoading()
    }

    errorRender() {
        this.removeLoading()
        this.dataset.fail = 'true';
        (this.querySelector('h4') as HTMLElement)
            .textContent = `${this.dataset.isbn}의 책 정보를 가져올 수 없습니다.`
        
    }

    onLibrary() {
        const isbn = this.dataset.isbn || ''
        const libraryBookExist = this.querySelector<LibraryBookExist>('library-book-exist')
        if (libraryBookExist) {
            libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, state.libraries)
        }
    }

    loading() {
        this.dataset.loading = 'true'
    }
    removeLoading() {
        delete this.dataset.loading
    }
    
    onClick(event: MouseEvent) {
        event.preventDefault()
        location.href = `book?isbn=${this.dataset.isbn}`
    }
}

