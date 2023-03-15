
// import { setState } from '../../modules/model.js'
// import CustomFetch from "../../modules/CustomFetch.js"
import { setState, CustomFetch } from '../../modules/index.js'

export default class SetStorage extends HTMLElement {
    constructor() {
        super()
        this.storageButton = this.querySelector('.localStorage button')
        this.resetButton = this.querySelector('.resetStorage button')
        this.customFetch = new CustomFetch()
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
            const data = await this.customFetch.fetch(url)
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