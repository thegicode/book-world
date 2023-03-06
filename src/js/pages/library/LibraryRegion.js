import { $ } from './selectors.js'

export default class LibraryRegion extends HTMLElement {
	constructor() {
		super()
		this.select = this.querySelector('select')
		$.appLibrary.regionCode = this.select.value
	}

	connectedCallback() {
		this.select.addEventListener('change', this.onChange.bind(this))
	}

	disconnectedCallback() {
		this.select.removeEventListener('change', this.onChange.bind(this))
	}

	onChange() {
		const { value, selectedIndex } = this.select
		$.appLibrary.regionCode = value
	}

}