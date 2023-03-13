
import { setState } from '../../modules/model.js'

export default class SetStorage extends HTMLElement {
    constructor() {
        super()
        this.storageButton = this.querySelector('.localStorage button')
        this.resetButton = this.querySelector('.resetStorage button')
    }

    connectedCallback() {
        this.storageButton.addEventListener('click', this.setLocalStorageToBase.bind(this))
        this.resetButton.addEventListener('click', this.resetStorage.bind(this))
    }

    disconnectedCallback() {
        this.storageButton.addEventListener('click', this.setLocalStorageToBase)
        this.resetButton.addEventListener('click', this.resetStorage)
    }

    async setLocalStorageToBase() {
        const url = `../../json/storage-sample.json`
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Fail to get storage sample data.')
            }
            const data = await response.json()
            setState(data)
            console.log('Saved local stronage by base data!')
        } catch(error) {
            console.error(error)
            throw new Error('Fail to get storage sample data.')
        }
    }

    resetStorage() {
        localStorage.removeItem('BookWorld')
    }
}