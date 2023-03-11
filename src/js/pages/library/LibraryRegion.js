import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class LibraryRegion extends HTMLElement {
	constructor() {
		super()
		this.select = this.querySelector('select')
		this.regionElements = this.querySelectorAll('[name=region]')
	}

	connectedCallback() {
		this.checkRegion()
		this.select.addEventListener('change', this.onChangeDetail.bind(this))
		this.onChangeDetail()
	}

	disconnectedCallback() {
		this.select.removeEventListener('change', this.onChange)
	}

	checkRegion(checkbox) {
		let regionList = []
		this.regionElements.forEach( checkbox => {
			checkbox.addEventListener('change', (event) => {
				const { checked, value } = checkbox
				if (checked) {
					regionList.push(value)
					// console.log(this, value)
					// this.fetchLibrarySearch(value)
				} else {
					const index = regionList.indexOf(value)
					regionList.splice(index, 1)
				}
				console.log('checkRegion', regionList)
			})
		})
	}

	onChangeDetail() {
		const { value, selectedIndex } = this.select
        CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: value })

	}

}