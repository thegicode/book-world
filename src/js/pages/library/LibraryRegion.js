import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class LibraryRegion extends HTMLElement {
	constructor() {
		super()
		this.select = this.querySelector('select')
	}

	connectedCallback() {
		this.select.addEventListener('change', this.onChange.bind(this))
		this.onChange()
	}

	disconnectedCallback() {
		this.select.removeEventListener('change', this.onChange.bind(this))
	}

	onChange() {
		const { value, selectedIndex } = this.select
        CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: value })

	}

}