export default class BaseItemComponent extends HTMLElement {
    protected template: HTMLTemplateElement;

    constructor(template: HTMLTemplateElement) {
        super();
        this.template = template;
    }

    connectedCallback() {
        this.appendChild(this.template.content.cloneNode(true));
        this.onMount();
    }

    /**
     *  Called when the component is mounted to the DOM.
     *  Subclasses can override this method to perform actions
     *  after the template is rendered.
     */
    protected onMount() {
        // To be implemented by subclasses
    }
}
