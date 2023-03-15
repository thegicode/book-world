
import { getState, addRegion, addDetailRegion, removeDetailRegion } from '../../modules/model.js'
import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class SetDetailRegion extends HTMLElement {
    constructor() {
        super()
        this.detailRegionsElement = this.querySelector('.detailRegions')
        this.regionData = null
    }

    connectedCallback() {
        CustomEventEmitter.add('fetch-region-data', this.setRegionData.bind(this))
        CustomEventEmitter.add('set-favorite-regions', this.renderRegion.bind(this))
    }

    disconnectedCallback() {
        CustomEventEmitter.remove('fetch-region-data', this.setRegionData)
        CustomEventEmitter.remove('set-favorite-regions', this.renderRegion)
    }

    setRegionData({ detail }) {
        this.regionData = detail.regionData
        this.renderRegion()
    }


 
    renderRegion() {
        const favoriteRegions = Object.keys(getState().regions)
        const fragment = new DocumentFragment()
        const template = document.querySelector('#tp-favorite-region').content.firstElementChild
		const container = this.querySelector('.regions')
        container.innerHTML = ''
        favoriteRegions.forEach( key => {
			const element = template.cloneNode(true)
			element.querySelector('span').textContent = key
			fragment.appendChild(element)
		})
        container.appendChild(fragment)

		const firstInput = container.querySelector('input')
		firstInput.checked = true
        const label = firstInput.nextElementSibling.textContent
		this.renderDetailRegions(label)
		this.changeRegion()
    }

    renderDetailRegions(regionName) { 
        if (!this.regionData) return
        const regionObj = getState().regions[regionName]
        const regionCodes = regionObj? Object.values(regionObj) : []

        const template = document.querySelector('#tp-detail-region').content.firstElementChild
		this.detailRegionsElement.innerHTML = ''
        const fragment = new DocumentFragment()

		const detailRegionObject = this.regionData.detailRegion[regionName]
        if (!detailRegionObject) return
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
        this.detailRegionsElement.region = regionName
		this.onChangeDetail()
	}

    changeRegion() {
		const regionRadios = this.querySelectorAll('[name=favorite-region]')
		for (const radio of regionRadios) {
			radio.addEventListener('change', () => {
				if (radio.checked) {
					const value = radio.value
                    const label = radio.nextElementSibling.textContent
					this.renderDetailRegions(label)
				}
			})
		}
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
                CustomEventEmitter.dispatch('set-detail-regions', {})
            })
        })


    }
    
}