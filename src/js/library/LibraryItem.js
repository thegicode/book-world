import model from '../model.js'

const models = model()
const  { setLibrary } = models

export default class LibraryItem extends HTMLElement {
	constructor() {
		super()
		this.radio = this.querySelector('[name=myLibrary]')
	}

	connectedCallback() {
		this.render(this.data)
		this.radio.addEventListener('change', this.onChange.bind(this))
	}

	disConnectedCallback() {
		this.radio.removeEventListener('change', this.onChange.bind(this))

	}

	render(data) {
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
			BookCount } = data

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
        this.radio.value = libCode
	}

	onChange(event) {
		setLibrary(event.target.value)

	}

}