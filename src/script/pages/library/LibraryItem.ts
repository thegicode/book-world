import { addLibrary, removeLibrary, hasLibrary } from '../../modules/model'

interface LibraryData {
	libCode: string
	libName: string
	address: string
	telephone: string
	homepage: string
}

export default class LibraryItem extends HTMLElement {

	#checkbox: HTMLInputElement | null = null
	#libCode = ''
	#libName = ''
	data: LibraryData

	constructor() {
		super()
		this.#checkbox = this.querySelector('[name=myLibrary]') as HTMLInputElement || null
		this.#libCode = ''
		this.#libName = ''
		this.data = {
			libCode: '',
			libName: '',
			address: '',
			telephone: '',
			homepage: ''
		}
	}

	connectedCallback() {
		this.render()
		this.#checkbox?.addEventListener('click', event => this.onChange.bind(this))
	}

	disconnectedCallback() {
		this.#checkbox?.addEventListener('click', event => this.onChange)

	}
	
	render(): void {
		const { data } = this
		const keys = Object.keys(data)

		// keys.forEach( key => {
		// 	const element = this.querySelector(`.${key}`)
		// 	if (element) {
		// 		element.innerHTML = `${data[key as keyof LibraryData]}`
		// 	}
		// })

		for (const key of keys) {
			const element = this.querySelector(`.${key}`)
			if (element) {
				element.innerHTML = `${data[key as keyof LibraryData]}`
			}
		}

		(this.querySelector('.homepage') as HTMLLinkElement).href = data.homepage

		const { libCode, libName } = data
		this.#libCode = libCode
		this.#libName = libName

		this.#checkbox!.checked = hasLibrary(libCode)
	}

	onChange(event: MouseEvent) {
		(event.target as HTMLInputElement).checked
			? addLibrary(this.#libCode, this.#libName)
			: removeLibrary(this.#libCode)
	}

}

