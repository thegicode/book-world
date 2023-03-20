
import { getState } from './model.js'

export const updateFavoriteBooksSize = (length?: number) => {
    const navElement = document.querySelector('nav-gnb')!
    const size = length || getState().favoriteBooks.length
    navElement.querySelector('.size')!.textContent = String(size)
}