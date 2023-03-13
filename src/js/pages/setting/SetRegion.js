
import { getState, addRegion, addDetailRegion, removeDetailRegion } from '../../modules/model.js'
import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class SetRegion extends HTMLElement {
    constructor() {
        super()
        this.detailRegionsElement = this.querySelector('.detailRegions')
        this.regionObject = {}
    }

    connectedCallback() {
        this.fetchRegion()
    }

    disconnectedCallback() {}

    async fetchRegion() {
		const url = '../../json/region.json'
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
		const regionContainer = this.querySelector('.regions')

		const regionObject = this.regionObject['region']
		for (const [ key, value ] of Object.entries(regionObject)) {
			const element = regionTemplate.cloneNode(true)
			element.querySelector('[type=radio]').value = value
			element.querySelector('span').textContent = key
			regionContainer.appendChild(element)
		}

		const firstInput = regionContainer.querySelector('input')
		firstInput.checked = true
        const label = firstInput.nextElementSibling.textContent
		this.renderDetailRegion(label, firstInput.value)

		this.changeRegion()
    }

    changeRegion() {
		const regionRadios = this.querySelectorAll('[name=region]')
		for (const radio of regionRadios) {
			radio.addEventListener('change', () => {
				if (radio.checked) {
					const value = radio.value
                    const label = radio.nextElementSibling.textContent
					this.renderDetailRegion(label, value)
				}
			})
		}
	}

    renderDetailRegion(label, regionCode) { // 서울, 11
        const regionObj = getState().regions[label]
        const regionCodes = regionObj? Object.values(regionObj) : []

        const template = document.querySelector('#tp-detail-region').content.firstElementChild
		this.detailRegionsElement.innerHTML = ''
        const fragment = new DocumentFragment()

		const detailRegionObject = this.regionObject.detailRegion[regionCode]
		for (const [key, value] of Object.entries(detailRegionObject)) {
            const element = template.cloneNode(true)
            element.querySelector('span').textContent = key
            const input = element.querySelector('input')
			input.value = value
            if (regionCodes.includes(value)) {
                input.checked = true
                fragment.insertBefore(element, fragment.firstChild)
            } else {
                fragment.appendChild(element)
            }
		}
		this.detailRegionsElement.appendChild(fragment)
        this.detailRegionsElement.region = label
		this.onChangeDetail()
	}

    onChangeDetail() {
        const region = this.detailRegionsElement.region
        if (!getState().regions[region]) {
            addRegion(region)
        }
        const checkboxes = document.querySelectorAll('[name=detailRegion]')
        checkboxes.forEach( checkbox => {
            checkbox.addEventListener('change', () => {
                const { value } = checkbox
                const label = checkbox.nextElementSibling.textContent
                if (checkbox.checked) {
                    addDetailRegion(region, label, value)
                } else  {
                    removeDetailRegion(region, label)
                }
                CustomEventEmitter.dispatch('set-favorite-regions', {})
            })
        })


    }
    
}