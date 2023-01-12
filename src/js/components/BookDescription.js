
export default class BookDescription extends HTMLElement {
    constructor() {
        super()
        this.el = this.querySelector('.description')
        this.button = this.querySelector('.more-description-button')
    }

    // Favorite에서는 set으로 시작
    set data(value) {
        this.render(value)
    }

    connectedCallback() {
        this.render()

        this.button.addEventListener('click', this.onClickButton.bind(this))
    }

    disconnectedCallback() {
        this.button.removeEventListener('click', this.onClickButton.bind(this))
    }

    render(value) {
        // Search Book은 value를 부모에서 그린다. 
        // Search Book, Favorite 둘 다 isEllipsisActive은 필요하다
        // 그래서 render로 통해서 실행되게 했다.

        // Favorite
        if(value) {
            this.el.innerHTML = value
        }
        
        // Search Book, Favorite
        if(this.isEllipsisActive(this.el)) {
            this.button.ariaHidden = false
        }
    }

    isEllipsisActive(el) {
        return (el.offsetHeight < el.scrollHeight);
    }

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