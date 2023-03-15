import { CustomEventEmitter } from '../../utils/index.js'
import { getState } from '../../modules/model.js'

export default class LibraryRegion extends HTMLElement {
	constructor() {
		super()
		this.selectElement = this.querySelector('select')
		this.regionObject = {}
	}

	connectedCallback() {
		this.renderRegion()
		this.selectElement.addEventListener('change', this.onChangeDetail.bind(this))
	}

	disconnectedCallback() {
		this.selectElement.removeEventListener('change', this.onChange)
	}

	renderRegion() {
		const favoriteRegions = getState().regions
		if (Object.values(favoriteRegions).length < 1) return

		const template = document.querySelector('#tp-region').content.firstElementChild
		const container = this.querySelector('.region')

		const fragment = new DocumentFragment()
		for (const regionName of Object.keys(favoriteRegions)) {
			const size = Object.keys(favoriteRegions[regionName]).length
			if (size > 0) {
				const element = template.cloneNode(true)
				element.querySelector('input').value = regionName
				element.querySelector('span').textContent = regionName
				fragment.appendChild(element)
			}
		}
		container.appendChild(fragment)

		const firstInput = container.querySelector('input')
		firstInput.checked = true

		this.renderDetailRegion(firstInput.value)
		this.changeRegion()
	}

	changeRegion() {
		const regionRadios = this.querySelectorAll('[name=region]')
		for (const radio of regionRadios) {
			radio.addEventListener('change', () => {
				if (radio.checked) {
					const value = radio.value
					this.renderDetailRegion(value)
				}
			})
		}
	}

	renderDetailRegion(regionName) {
		this.selectElement.innerHTML = ''
		const detailRegionObject = getState().regions[regionName]
		for (const [key, value] of Object.entries(detailRegionObject)) {
			const optionEl = document.createElement('option')
			optionEl.textContent = key
			optionEl.value = value
			this.selectElement.appendChild(optionEl)
		}
		const firstInput = this.selectElement.querySelector('option')
		firstInput.selected = true
		this.onChangeDetail()
	}

	onChangeDetail() {
		const { value, selectedIndex } = this.selectElement
        CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: value })
	}

}