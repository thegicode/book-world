
import { getState } from '../../modules/model.js'
import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class FavoriteRegions extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
        CustomEventEmitter.add('set-favorite-regions', this.render.bind(this))
    }

    disconnectedCallback() {
        CustomEventEmitter.remove('set-favorite-regions', this.render)
    }

    render(){
        const container = this.querySelector('.favorites')
        container.innerHTML = ''
        let fragment = new DocumentFragment()
        const { regions } = getState()
        for (const regionName in regions) {
            const detaioRegions = Object.keys(regions[regionName])
            if (detaioRegions.length > 0) {
                const titleElement = document.createElement('h3')
                titleElement.textContent = regionName
                fragment.appendChild(titleElement)
                fragment = this.renderDetail(detaioRegions, fragment)
            }
        }
        container.appendChild(fragment)
    }

    renderDetail(detaioRegions, fragment) {
        detaioRegions.forEach( name => {
            const element = document.createElement('p')
            element.textContent = name
            fragment.appendChild(element)
        })
        return fragment
    }
    
}