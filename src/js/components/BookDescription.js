
export default class BookDescription extends HTMLElement {
    constructor() {
        super()
        this.el = null
        this.button = null
    }

    set data(value) {
        this.render(value)
    }

    connectedCallback() {
        this.render(this.data)
    }

    disconnectedCallback() {
        this.button.removeEventListener('click', this.onClickButton.bind(this))
    }

    render(value) {
        const template = `
            <p class="description" data-ellipsis="true">${value}</p>
            <button type="button" class="more-description-button">설명 더보기</button>`
        this.innerHTML = template

        this.el = this.querySelector('.description')
        this.button = this.querySelector('.more-description-button')

        this.button.addEventListener('click', this.onClickButton.bind(this))

        // if(this.isEllipsisActive(this.el)) {
        //     this.button.ariaHidden = false
        // }
    }

    // isEllipsisActive(el) {
    //     return (el.offsetHeight < el.scrollHeight);
    // }

    onClickButton() {
        switch(this.el.dataset.ellipsis) {
            case 'true':
                this.el.dataset.ellipsis = false
                this.button.textContent = '설명 접기'
                break
            case 'false':
                this.el.dataset.ellipsis = true
                this.button.textContent = '설명 더보기'
                break
            default:
                console.log('설명 더보기 버튼 실행')
        }
    }

}