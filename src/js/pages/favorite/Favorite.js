import { state } from '../../modules/model.js'

export default class Favorite extends HTMLElement {
    
    static get observedAttributes() {
        return ['count']
    }

    set count(value) {
        this.setAttribute('count', value)
    }
    get count() {
        return this.getAttribute('count')
    }

    constructor() {
        super()

        this.books = this.querySelector('.favorite-books')
        this.itemTemplate = document.querySelector('#tp-favorite-item')

        this.updateCount = this.updateCount.bind(this)

    }

    connectedCallback() {
        // 속성 변경을 감지하기 위해 MutationObserver를 사용합니다.
        this.observer = new MutationObserver(this.updateCount)

        this.updateCount()
        this.render()
    }

    disconnectedCallback() {
        // CustomElement가 DOM에서 제거될 때 MutationObserver도 제거합니다.
        this.observer.disconnect();
    }

    render() {
        // this.setAttribute('count', state.favoriteBooks.length)
        
        const fragemnt = new DocumentFragment()
        state.favoriteBooks.forEach( item => {
            const el = this.itemTemplate.content.firstElementChild.cloneNode(true)
            el.data = item
            fragemnt.appendChild(el)
        })
        this.books.appendChild(fragemnt)
    }

    updateCount() {
        const count = this.count | state.favoriteBooks.length
        this.querySelector('.count').textContent = `${count}권`
        // this.querySelector('.count').textContent = `${state.favoriteBooks.length}권`
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // observedAttributes 배열에 정의된 속성 중 하나가 변경되면 이 메소드가 호출됩니다.
        // name: 변경된 속성 이름
        // oldValue: 이전 속성 값
        // newValue: 새로운 속성 값
        console.log(`attributeChangedCallback : ${name}`, oldValue, newValue);
        this.updateCount(newValue)
    }

    // renderLoanHistory(el, data) {
    //     const fragemnt = new DocumentFragment()
    //     data.forEach( item => {
    //         const elLoan = document.querySelector('[data-template=history-item]').content.firstElementChild.cloneNode(true)
    //         const { month, loanCnt, ranking } = item
    //         elLoan.querySelector('.month').textContent = month
    //         elLoan.querySelector('.loanCnt').textContent = loanCnt
    //         elLoan.querySelector('.ranking').textContent = ranking
    //         fragemnt.appendChild(elLoan)
    //     })
    //     el.querySelector('.loanHistory ul').appendChild(fragemnt)

    // }

}

