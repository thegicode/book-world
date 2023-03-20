import { CustomEventEmitter, CustomFetch } from '../../utils/index.js'
import { hasLibrary } from '../../modules/model.js'
import LibraryItem from './LibraryItem.js'

interface LibraryData {
	libCode: string
	libName: string
	address: string
	telephone: string
	homepage: string
}

interface CustomEvent<T> extends Event {
    detail: T;
}

export default class Library extends HTMLElement {

	private form: HTMLFormElement

	constructor() {
		super()
		this.form = this.querySelector('form')!
	}

	connectedCallback() {
		CustomEventEmitter.add('set-detail-region', this.handleDetailRegion.bind(this) as EventListener)
	}

	disconnectedCallback() {
		CustomEventEmitter.remove('set-detail-region', this.handleDetailRegion as EventListener)
	}

	async fetchLibrarySearch(detailRegionCode: string) {
		try {
			const url = `/library-search?dtl_region=${detailRegionCode}&page=${1}&pageSize=${20}`
			const data = await CustomFetch.fetch(url)
			this.render(data)
		} catch(error) {
			console.error(error)
            throw new Error('Fail to get library search data.')
		}
	}

	render(data : { libs: LibraryData[] }) {
		const { 
			// pageNo, pageSize, numFound, resultNum, 
			libs } = data

		if (libs.length === 0) {
            this.showMessage('notFound')
            return
		}

		const template = (document.querySelector('#tp-item') as HTMLTemplateElement).content.firstElementChild
		const fragment = libs.reduce((fragment: DocumentFragment, lib: LibraryData) => {
			if (template) {
				const libraryItem = template.cloneNode(true) as LibraryItem
				libraryItem.dataset.object = JSON.stringify(lib)
				if(hasLibrary(lib.libCode)) {
					libraryItem.dataset.has = 'true'
					fragment.insertBefore(libraryItem, fragment.firstChild)
				} else {
					fragment.appendChild(libraryItem)
				}
			}
			return fragment
		}, new DocumentFragment())

		this.form.innerHTML = ''
		this.form.appendChild(fragment)
	}

	showMessage(type: string) {
        const template = (document.querySelector(`#tp-${type}`) as HTMLTemplateElement).content.firstElementChild 
		if (template) {
            const element = template.cloneNode(true) 
			this.form.innerHTML = ''
        	this.form.appendChild(element)
		}
	}

	handleDetailRegion(evt: CustomEvent<{ detailRegionCode: string }>) {
		this.showMessage('loading')
		this.fetchLibrarySearch(evt.detail.detailRegionCode)
	}

}
