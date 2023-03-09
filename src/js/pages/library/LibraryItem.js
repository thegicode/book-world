import { addLibrary, removeLibrary, hasLibrary } from '../../modules/model.js'

export default class LibraryItem extends HTMLElement {
	constructor() {
		super()
		this.checkbox = this.querySelector('[name=myLibrary]')
	}

	connectedCallback() {
		this.render(this.data)
		this.checkbox.addEventListener('change', (event) => this.onChange(event))
	}

	disconnectedCallback() {
		this.checkbox.removeEventListener('change', (event) => this.onChange(event))
	}

	render() {
		const {
			libCode,
			libName,
			address,
			tel,
			fax,
			// latitude,
			// longitude,
			homepage,
			closed,
			operatingTime,
			BookCount 
		} = this.data

		const obj = {
            libCode: `${libCode}`,
            libName: `${libName}`,
            address: `${address}`,
            tel: `${tel}`,
            fax: `${fax}`,
            homepage: `${homepage}`,
            closed: `${closed}`,
            operatingTime: `${operatingTime}`,
            BookCount: `${Number(BookCount).toLocaleString()}`,
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.${key}`).textContent = value
        }
        this.querySelector('.homepage').href = homepage

        this.checkbox.checked = hasLibrary(libCode)
        this.libCode = libCode
        this.libName = libName
	}

	onChange(event) {
		if (event.target.checked) {
			addLibrary(this.libCode, this.libName)
			return
		}
		removeLibrary(this.libCode)
	}

}
