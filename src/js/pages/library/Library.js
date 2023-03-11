import { hasLibrary } from '../../modules/model.js'
import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class Library extends HTMLElement {

	constructor() {
		super()
		this.form = this.querySelector('form')
	}

	connectedCallback() {
		CustomEventEmitter.add('set-detail-region', ({ detail }) => {
			this.request(detail.detailRegionCode)
		})
	}

	disconnectedCallback() {
		this.$observer.disconnect()
	}


	async request(regionCode) {
		this.showMessage('loading')
		try {
			const url = `/library-search?regionCode=${regionCode}&page=${1}&pageSize=${20}`
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error('Fail to get library search data.')
			}
			const data = await response.json()
			this.render(data)
		} catch(error) {
			console.error(error)
		}
	}

	render(data) {
		const { pageNo, pageSize, numFound, resultNum, libs } = data

		if (libs.length === 0) {
            this.showMessage('notFound')
            return
		}

        const fragment = this.createLibraryList(libs)

		this.form.innerHTML = ''
        this.form.appendChild(fragment)
	}

	createLibraryList(libs) {
		const favorites = libs.filter(lib => hasLibrary(lib.libCode))
		const others = libs.filter(lib => !(hasLibrary(lib.libCode)))

		const fragment = new DocumentFragment()
		const template = document.querySelector('#tp-item').content.firstElementChild

		const arr = [...favorites, ...others]
		arr.forEach( item => {
			const element = template.cloneNode(true)
			element.data = item
			if (hasLibrary(item.libCode)) {
				element.dataset.has = true
			}
			fragment.appendChild(element)
		})
		
		return fragment
	}

	showMessage(type) {
		const tpl = document.querySelector(`#tp-${type}`)
		const el = tpl.content.firstElementChild.cloneNode(true)
		this.form.innerHTML = ''
        this.form.appendChild(el)
	}

}