import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class LibraryRegion extends HTMLElement {
	constructor() {
		super()
		this.selectElement = this.querySelector('.detailRegion')
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
		const regionTemplate = document.querySelector('#tp-region').content.firstElementChild
		const regionContainer = this.querySelector('.region')

		const regionObject = this.regionObject['region']
		for (const [ key, value ] of Object.entries(regionObject)) {
			const element = regionTemplate.cloneNode(true)
			element.querySelector('input').value = value
			element.querySelector('span').textContent = key
			regionContainer.appendChild(element)
		}

		const firstInput = regionContainer.querySelector('input')
		firstInput.checked = true
		this.renderDetailRegion(firstInput.value)

		this.changeRegion()
	}

	changeRegion() {
		const regionRadios = this.querySelectorAll('[name=region]')
		const handleChange = (event) => {
			const selectedRadio = event.target
			const value = selectedRadio.value
			const key = selectedRadio.nextElementSibling.textContent
			this.renderDetailRegion(value)
		}
		regionRadios.forEach( radio => {
			radio.addEventListener('change', handleChange)
		})
	}

	renderDetailRegion(value) { // 서울, 11
		this.selectElement.innerHTML = ''
		const detailRegionObject = this.regionObject['detailRegion'][value]
		for(const key in detailRegionObject) {
			const optionEl = document.createElement('option')
			optionEl.textContent = key
			optionEl.value = detailRegionObject[key]
			this.selectElement.appendChild(optionEl)
		}
		const firstValue = this.selectElement.querySelector('option').value
		CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: firstValue })
	}

	onChangeDetail() {
		const { value, selectedIndex } = this.selectElement
        CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: value })
	}

}