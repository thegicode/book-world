
import { CustomFetch, CustomEventEmitter } from '../../utils/index.js'
import { setState } from '../../modules/model.js'

export default class SetStorage extends HTMLElement {

    storageButton: HTMLButtonElement
    resetButton: HTMLButtonElement

    constructor() {
        super()
        this.storageButton = this.querySelector('.localStorage button') as HTMLButtonElement
        this.resetButton = this.querySelector('.resetStorage button') as HTMLButtonElement
    }

    connectedCallback() {
        this.storageButton.addEventListener('click', this.setLocalStorageToBase.bind(this))
        this.resetButton.addEventListener('click', this.resetStorage.bind(this))
    }

    disconnectedCallback() {
        this.storageButton.removeEventListener('click', this.setLocalStorageToBase)
        this.resetButton.removeEventListener('click', this.resetStorage)
    }

    async setLocalStorageToBase() {
        const url = `../../json/storage-sample.json`
        try {
            const data = await CustomFetch.fetch(url)
            setState(data)
            console.log('Saved local stronage by base data!')
            CustomEventEmitter.dispatch('favorite-books-changed')
        } catch(error) {
            console.error(error)
            throw new Error('Fail to get storage sample data.')
        }
    }

    resetStorage() {
        localStorage.removeItem('BookWorld')
        CustomEventEmitter.dispatch('favorite-books-changed', { size : 0 })

    }
}