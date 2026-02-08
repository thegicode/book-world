
const templateCache = new Map<string, HTMLTemplateElement>();

export default class BaseItemComponent extends HTMLElement {
    protected templatePath: string;
    protected template: HTMLTemplateElement | null = null;

    constructor(templatePath: string) {
        super();
        this.templatePath = templatePath;
    }

    async connectedCallback() {
        await this.loadTemplate();
        if (this.template) {
            this.appendChild(this.template.content.cloneNode(true));
            this.onMount();
        }
    }

    protected async loadTemplate() {
        if (templateCache.has(this.templatePath)) {
            this.template = templateCache.get(this.templatePath)!;
            return;
        }

        try {
            const response = await fetch(this.templatePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch template: ${this.templatePath}`);
            }
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            this.template = template;
            templateCache.set(this.templatePath, template);
        } catch (error) {
            console.error(error);
        }
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

