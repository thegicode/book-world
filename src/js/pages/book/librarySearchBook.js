
import {  getState } from '../../modules/model.js'
import CustomFetch from "../../modules/CustomFetch.js"
const customFetch = new CustomFetch()

export default function librarySearchBook(isbn) {
    fetchList(isbn)
}

async function fetchList(isbn) {
    const favoriteLibraries = getState().regions
    for (const item in favoriteLibraries) {
        const detailCodes = Object.values(favoriteLibraries[item])
        const regionCode = detailCodes[0].slice(0, 2)
        detailCodes.forEach( detailCode => {
            fetchLibrarySearchByBook(isbn, regionCode, detailCode)
        })
    }
}
    
async function fetchLibrarySearchByBook(isbn, region, dtl_region) {
    const url = new URL('/library-search-by-book', window.location.href)
    url.searchParams.set('isbn', isbn)
    url.searchParams.set('region', region)
    url.searchParams.set('dtl_region', dtl_region)

    try {
        const data = await customFetch.fetch(url.toString())
        render(data, isbn)
    } catch (error) {
        console.error(error)
        throw new Error(`Fail to get library search by book.`)
    }
}
    
function render({ libs }, isbn) {
    const container = document.querySelector('.library-search-by-book')
    if (!container) return

    const listElement = document.createElement('ul')
    const fragment = new DocumentFragment()

    if (!Array.isArray) return

    libs.forEach(({ homepage, libCode, libName }) => {
        const template = document.querySelector('#tp-librarySearchByBookItem')
        if (!template) return

        const cloned = template.content.firstElementChild.cloneNode(true)
        const link = cloned.querySelector('a')
        if (!link) return

        cloned.dataset.code = libCode
        link.textContent = libName
        link.href = homepage

        loanAvailable(isbn, libCode, cloned.querySelector('p'))
        
        fragment.appendChild(cloned)
    })

    listElement.appendChild(fragment)
    container.appendChild(listElement)
}

async function loanAvailable(isbn13, libCode, el) {
    const isAvailable = await fetchLoadnAvailabilty(isbn13, libCode)
    const element = el.querySelector('.loanAvailable')
    element.textContent = isAvailable ? '대출 가능' : '대출 불가'
    if (isAvailable) {
        el.parentElement.dataset.available = true
    }
}

async function fetchLoadnAvailabilty(isbn13, libCode) {
    try {
        const data = await customFetch.fetch(`/book-exist?isbn13=${isbn13}&libCode=${libCode}`)
        return data.loanAvailable === 'Y'
    } catch (error) {
        console.error(error)
        throw new Error(`Fail to get book exist.`)
    }
}


