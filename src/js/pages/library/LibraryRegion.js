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
		this.checkRegion()
	}

	checkRegion() {
		let regionList = []
		const checkboxElements = this.querySelectorAll('[name=region]')
		checkboxElements.forEach( checkbox => {
			checkbox.addEventListener('change', (event) => {
				const { checked, value } = checkbox
				if (checked) {
					regionList.push(value)
					const key = checkbox.nextElementSibling.textContent
					this.renderDetailRegion(key, value)
				} else {
					const index = regionList.indexOf(value)
					regionList.splice(index, 1)
				}
				// console.log('checkRegion', regionList)
			})
		})
	}

	renderDetailRegion(key, value) {
		const detailRegionObject = this.regionObject['detailRegion'][value]
		for(const key in detailRegionObject) {
			console.log(key, detailRegionObject[key])
		}
	}

	onChangeDetail() {
		const { value, selectedIndex } = this.selectElement
        CustomEventEmitter.dispatch('set-detail-region', { detailRegionCode: value })

	}

	

}