import model from '../modules/model.js'
const  { includesLibrary } = model

export default class Library extends HTMLElement {
	constructor() {
		super()
		this.form = this.querySelector('form')
	}

	set regionCode(v) {
		// this._regionCode = v
		this.request(v)
	}
	// get regionCode() {
	// 	return this._regionCode
	// }

	request(regionCode) {
		this.loading()
		fetch(`/libSrch?regionCode=${regionCode}&page=${1}&pageSize=${20}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(response => {
        	this.render(response)
        })
        .catch(e => {
            console.log(e)
        });
	}

	render(data) {
		if (data.libs.length === 0) {
            this.notFound()
            return
		}

		const { pageNo, pageSize, numFound, resultNum, libs } = data
        const fragemnt = new DocumentFragment()

		libs.forEach( item => {
            const el = document.querySelector('#tp-item').content.firstElementChild.cloneNode(true)
            el.data = item
            if (includesLibrary(item.libCode)) {
            	el.dataset.has = true

            	const target = fragemnt.querySelector('[data-has=true]')
            	if (target) {
            		target.after(el)
            		return
            	} 
            	fragemnt.insertBefore(el, fragemnt.firstElementChild)

            	return
            } 
            fragemnt.appendChild(el)
		})
		this.form.innerHTML = ''
        this.form.appendChild(fragemnt)
	}

	notFound() {
		const notfoundEl = document.querySelector('#tp-notFound').content.firstElementChild.cloneNode(true)
		this.form.innerHTML = ''
        this.form.appendChild(notfoundEl)
	}


	loading() {
		const loadingEl = document.querySelector('#tp-loading').content.firstElementChild.cloneNode(true)
		this.form.innerHTML = ''
        this.form.appendChild(loadingEl)
	}

}