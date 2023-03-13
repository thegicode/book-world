
import { getState, addRegion, removeRegion } from '../../modules/model.js'
import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class SetRegion extends HTMLElement {
    constructor() {
        super()
        
        this.regionData = {}
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
			this.regionData = await response.json()
			this.render()
		} catch(error) {
			console.error(error)
		}
	}

    render() {
        const template = document.querySelector('#tp-region').content.firstElementChild
		const container = this.querySelector('.regions')

		const regionData = this.regionData['region']
        const fragment = new DocumentFragment()

        const stateRegions = Object.keys(getState().regions)
		for (const [ key, value ] of Object.entries(regionData)) {
			const element = template.cloneNode(true)
            const checkbox = element.querySelector('input')
			checkbox.value = value
            if (stateRegions.includes(key)) {
                checkbox.checked = true
            }
			element.querySelector('span').textContent = key
			fragment.appendChild(element)
		}
        container.appendChild(fragment)

		this.changeRegion()
    }

    changeRegion() {
        const checkboxes = this.querySelectorAll('[name=region]')
        checkboxes.forEach( checkbox => {
            checkbox.addEventListener('change', () => {
                const key = checkbox.nextElementSibling.textContent
                if (checkbox.checked) {
                    addRegion(key)
                } else {
                    removeRegion(key)
                }
                CustomEventEmitter.dispatch('set-favorite-regions', {})
            })
        } )
    }
    
}