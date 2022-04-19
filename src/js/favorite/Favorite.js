
import model from '../model.js'
const  { state } = model


export default class Favorite extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.updateCount()

        const fragemnt = new DocumentFragment()
        state.favorite.forEach( (item) => {
            const el = document.querySelector('[data-template=favorite-item]').content.firstElementChild.cloneNode(true)
            el.data = item
            fragemnt.appendChild(el)
        })
        this.querySelector('.favorite-books').appendChild(fragemnt)
    }

    disConnectedCallback() {
        this.favoriteButton.removeEventListener('click', this.onFavorite.bind(this))
    }

    updateCount() {
        this.querySelector('.count')
            .textContent = `${state.favorite.length}권`
    }

    renderLoanHistory(el, data) {
        const fragemnt = new DocumentFragment()
        data.forEach( item => {
            const elLoan = document.querySelector('[data-template=history-item]').content.firstElementChild.cloneNode(true)
            const { month, loanCnt, ranking } = item
            elLoan.querySelector('.month').textContent = month
            elLoan.querySelector('.loanCnt').textContent = loanCnt
            elLoan.querySelector('.ranking').textContent = ranking
            fragemnt.appendChild(elLoan)
        })
        el.querySelector('.loanHistory ul').appendChild(fragemnt)

    }

}

