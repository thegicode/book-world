import { addLibrary, removeLibrary, hasLibrary } from '../../modules/model.js'

export default class LibraryItem extends HTMLElement {

	#checkbox = null
	#libCode = ''
	#libName = ''

	constructor() {
		super()
		this.#checkbox = this.querySelector('[name=myLibrary]') || null
		this.#libCode = ''
		this.#libName = ''
	}

	connectedCallback() {
		this.render(this.data)
		this.#checkbox.onclick = event => this.onChange(event)
	}

	disconnectedCallback() {
		this.#checkbox.onclick = null
	}
	
	render() {
		const { data } = this
		const keys = Object.keys(data)

		keys.forEach( key => {
			const element = this.querySelector(`.${key}`)
			if (element) {
				element.innerHTML = `${data[key]}`
			}
		})

		this.querySelector('.homepage').href = data.homepage

		const { libCode, libName } = data
		this.#libCode = libCode
		this.#libName = libName

		this.#checkbox.checked = hasLibrary(libCode)
	}

	onChange(event) {
		(event.target.checked) 
			? addLibrary(this.#libCode, this.#libName)
			: removeLibrary(this.#libCode)
	}

}
