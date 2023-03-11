import { $ } from './selectors.js'
import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class LibraryRegion extends HTMLElement {
	constructor() {
		super()
		this.select = this.querySelector('select')
		// $.appLibrary.regionCode = this.select.value
	}

	// set detailRegion(value) {
	// 	this.dataset.detailRegion = value
	// }

	connectedCallback() {
		this.select.addEventListener('change', this.onChange.bind(this))
		this.onChange()
	}

	disconnectedCallback() {
		this.select.removeEventListener('change', this.onChange.bind(this))
	}

	onChange() {
		const { value, selectedIndex } = this.select
		// $.appLibrary.regionCode = value
        CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: value })
		// this.detailRegion = value

	}

}