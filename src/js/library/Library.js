
export default class Library extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		fetch(`/libSrch?page=${1}&pageSize=${20}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(response => {
        	this.render(response)
        })
        .catch(e => {
            console.log(e);
        });
	}

	disConnectedCallback() {
	}

	render(data) {
		const { pageNo, pageSize, numFound, resultNum, libs } = data
        const fragemnt = new DocumentFragment()
		libs.forEach( item => {
            const el = document.querySelector('template').content.firstElementChild.cloneNode(true)
            el.data = item
            fragemnt.appendChild(el)
		})
        this.querySelector('form').appendChild(fragemnt)
	}
}