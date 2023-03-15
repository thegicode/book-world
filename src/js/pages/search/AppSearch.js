import { CustomEventEmitter } from '../../modules/index.js'

export default class AppSearch extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.setKeyword()
        window.addEventListener('popstate', this.onPopState.bind(this))
    }

    disconnectedCallback() {
        window.removeEventListener('popstate', this.onPopState)
    }

    onPopState() {
        this.setKeyword()
    }

    setKeyword() {
        const params = new URLSearchParams(location.search)
        const keyword = params.get('keyword')
        CustomEventEmitter.dispatch('search-page-init', { keyword })
    }
    
}