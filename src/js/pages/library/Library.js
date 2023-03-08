import { hasLibrary } from '../../modules/model.js'

export default class Library extends HTMLElement {
	constructor() {
		super()
		this.form = this.querySelector('form')
	}

	set regionCode(v) {
		this.request(v)
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

        const fragment = this.renderBookList(libs)

		this.form.innerHTML = ''
        this.form.appendChild(fragment)
	}

	renderBookList(libs) {
		const fragment = new DocumentFragment()
		const template = document.querySelector('#tp-item').content.firstElementChild
		
		const favorites = []
		const others = []

		libs.forEach( libData => {
            const element = template.cloneNode(true)
            element.data = libData
			
			if (hasLibrary(libData.libCode)) {
				element.dataset.has = true
				favorites.push(element)
			} else {
				others.push(element)
			}
		})

		favorites.forEach( el => fragment.appendChild(el))
		others.forEach( el => fragment.appendChild(el))
		return fragment
	}

	showMessage(type) {
		const tpl = document.querySelector(`#tp-${type}`)
		const el = tpl.content.firstElementChild.cloneNode(true)
		this.form.innerHTML = ''
        this.form.appendChild(el)
	}

}