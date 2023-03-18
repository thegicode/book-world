
import { BookImage } from '../../components/index'
import { CustomFetch } from '../../utils/index'

interface BookData {
    bookname: string
    authors: string
    bookImageURL: string
    class_nm: string
    class_no: string
    description: string
    isbn13: string
    loanCnt: number
    publication_year: string
    publisher: string
}

interface KeywordData {
    word: string
}

interface RecBookData {
    bookname: string
    isbn13: string
}

interface UsageAnalysisListData {
    book: BookData
    keywords: KeywordData[]
    recBooks: RecBookData[]
}

export default class Book extends HTMLElement {

    private $loadingElement: HTMLElement
    private data: UsageAnalysisListData | null

    constructor() {
        super()
        this.$loadingElement = this.querySelector('.loading')!
        this.data = null
    }

    connectedCallback(): void {
        const isbn = new URLSearchParams(location.search).get('isbn')
        this.dataset.isbn = isbn!
        this._fetchUsageAnalysisList(isbn!)
    }

    async _fetchUsageAnalysisList(isbn: string): Promise<void> {
        try {
            const data = await CustomFetch.fetch(`/usage-analysis-list?isbn13=${isbn}`)
            this.data = data
            this._render()
        } catch (error) {
            this._renderError()
            console.log(error)
            throw new Error(`Fail to get usage analysis list.`)
        }
    }

    _render() {
        const {
            book: {
                bookname, authors, bookImageURL, class_nm, class_no, description, isbn13, loanCnt, publication_year, publisher
            },
            keywords,
            recBooks
        } = this.data! // coLoanBooks, loanGrps,loanHistory,

        const bookNames = bookname
            .split(/[=/:]/)
            .map(item => `<p>${item}</p>`)
            .join('')
        const keywordsString = keywords
            .map(item => `<span>${item.word}</span>`)
            .join('')
        const recBooksString = recBooks
            .map(({ bookname, isbn13 }) => `<li><a href=book?isbn=${isbn13}>${bookname}</a></li>`)
            .join('')
        this.querySelector('.bookname')!.innerHTML = bookNames
        this.querySelector('.authors')!.textContent = authors
        this.querySelector('.class_nm')!.textContent = class_nm
        this.querySelector('.class_no')!.textContent = class_no
        this.querySelector('.description')!.textContent = description
        this.querySelector('.isbn13')!.textContent = isbn13
        this.querySelector('.loanCnt')!.textContent = loanCnt.toLocaleString()
        this.querySelector('.publication_year')!.textContent = publication_year
        this.querySelector('.publisher')!.textContent = publisher
        this.querySelector('.keyword')!.innerHTML = keywordsString
        this.querySelector('.recBooks')!.innerHTML = recBooksString
        
        this.querySelector<BookImage>('book-image')!.data = {
            bookImageURL,
            bookname
        }

        this.$loadingElement.remove()
    }


    _renderError() {
        this.$loadingElement.textContent = '정보를 가져올 수 없습니다.'
    }
}

