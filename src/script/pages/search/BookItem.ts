import { state } from '../../modules/model'
import { BookDescription, BookImage, LibraryBookExist } from '../../components';

interface BookData {
    author: string;
    description: string;
    image: string;
    isbn: string;
    link: string;
    pubdate: string;
    publisher: string;
    title: string;
}

export default class BookItem extends HTMLElement {

    libraryButton!: HTMLButtonElement
    libraryBookExist!: LibraryBookExist
    link!: HTMLElement
    data!: BookData
    index!: number

    constructor() {
        super()
    }

    connectedCallback() {
        this.libraryButton = this.querySelector('.library-button') as HTMLButtonElement
        this.libraryBookExist = this.querySelector<LibraryBookExist>('library-book-exist')!
        this.link = this.querySelector('.book-summary') as HTMLElement

        this.render()

        this.libraryButton.addEventListener('click', this.onClickLibraryButton.bind(this))
        this.link.addEventListener('click', this.onClickLink.bind(this))
    }

    disconnectedCallback() {
        this.libraryButton.removeEventListener('click', this.onClickLibraryButton)
        this.link.removeEventListener('click', this.onClickLink)
    }

    render() {
        const { 
            author,
            description,
            image,
            isbn,
            link,
            pubdate,
            publisher,
            title,
            // discount,
            // price,
        } = this.data

        const formattedPubdate = `${pubdate.substring(0,4)}.${pubdate.substring(4,6)}.${pubdate.substring(6)}`
        this.querySelector('.title')!.textContent = title
        this.querySelector('.publisher')!.textContent = publisher
        this.querySelector('.author')!.textContent = author
        this.querySelector('.pubdate')!.textContent = formattedPubdate
        this.querySelector('.isbn')!.textContent = `isbn : ${isbn.split(' ').join(', ')}`
        this.querySelector<BookDescription>('book-description')!.data = description;
        (this.querySelector('.__link') as HTMLAnchorElement).href = link

        this.querySelector<BookImage>('book-image')!.data = {
            bookImageURL: image,
            bookname: title
        }

        this.dataset.index = this.index.toString()
        // this.isbn = isbn.split(' ')[0]
        this.dataset.isbn = isbn

    }

    onClickLibraryButton() {
        const isbn = this.dataset.isbn || ''
        this.libraryBookExist
            .onLibraryBookExist(this.libraryButton, isbn, state.libraries)

    }
    
    onClickLink(event: MouseEvent) {
        event.preventDefault()
        location.href = `book?isbn=${this.dataset.isbn}`
    }

}




 // const mm = (pubdate.length === 7) ? `0${pubdate.substring(4, 5)}` : pubdate.substring(4, 6)
        // const dd = pubdate.substring(pubdate.length - 2, pubdate.length)

        // const obj = {
        //     title: `${title}`,
        //     author: `${author}`,
        //     description: `${description}`,
        //     // price: `${Number(price).toLocaleString()}원`,
        //     publisher: `${publisher}`,
        //     pubdate: `${formattedPubdate}`,
        //     isbn: `isbn : ${isbn.split(' ').join(', ')}`
        // }
        // for (const [key, value] of Object.entries(obj)) {
        //     this.querySelector(`.${key}`).innerHTML = value
        // }