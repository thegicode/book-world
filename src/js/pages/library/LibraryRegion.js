import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class LibraryRegion extends HTMLElement {
	constructor() {
		super()
		this.selectElement = this.querySelector('select')
		this.regionObject = {}
	}

	connectedCallback() {
		this.fetchRegion()
		this.selectElement.addEventListener('change', this.onChangeDetail.bind(this))
		this.onChangeDetail()
	}

	disconnectedCallback() {
		this.selectElement.removeEventListener('change', this.onChange)
	}

	async fetchRegion() {
		const url = '../../../json/region.json'
		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error('Fail to get detail region data.')
			}
			this.regionObject = await response.json()
			this.renderRegion()
		} catch(error) {
			console.error(error)
		}
		
	}

	renderRegion() {
		const template = document.querySelector('#tp-region').content.firstElementChild
		const fragment = new DocumentFragment()
		const regionObj = this.regionObject['region']
		for(let key in regionObj) {
			const element = template.cloneNode(true)
			element.querySelector('input').value = regionObj[key]
			element.querySelector('span').textContent = key
			fragment.appendChild(element)
		}
		this.querySelector('.setRegion').appendChild(fragment)
		this.changeRegion()
	}

	changeRegion() {
		const regionRadios = this.querySelectorAll('[name=region]')
		const handleChange = (event) => {
			const selectedRadio = event.target
			const value = selectedRadio.value
			const key = selectedRadio.nextElementSibling.textContent
			this.renderDetailRegion(key, value)
		}
		regionRadios.forEach( radio => {
			radio.addEventListener('change', handleChange)
		})
	}

	renderDetailRegion(key, value) { // 서울, 11
		const detailRegionObject = this.regionObject['detailRegion'][value]
		for(const key in detailRegionObject) {
			// console.log(key, detailRegionObject[key])
		}
	}

	onChangeDetail() {
		const { value, selectedIndex } = this.selectElement
        CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: value })

	}

	

}