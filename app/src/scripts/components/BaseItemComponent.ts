// 템플릿 문자열을 한 번 파싱한 결과를 저장하는 캐시
const templateCache = new Map<string, HTMLTemplateElement>();

export default class BaseItemComponent extends HTMLElement {
    protected templateString = "";
    protected templateSelector = "";
    protected isSelector = false;
    protected template: HTMLTemplateElement | null = null;

    constructor(templateSource: string, isSelector = false) {
        super();
        this.isSelector = isSelector;
        if (isSelector) {
            this.templateSelector = templateSource;
        } else {
            this.templateString = templateSource;
        }
    }

    connectedCallback() {
        this.loadTemplate();
        if (this.template) {
            this.appendChild(this.template.content.cloneNode(true));
            this.onMount();
        }
    }

    protected loadTemplate() {
        if (this.isSelector) {
            // 셀렉터로 템플릿 찾기
            const template = document.querySelector(this.templateSelector) as HTMLTemplateElement;
            if (template) {
                this.template = template;
            } else {
                console.error(`Template not found for selector: ${this.templateSelector}`);
            }
            return;
        }

        // 동일한 템플릿 문자열에 대해서는 파싱을 한 번만 수행
        const cachedTemplate = templateCache.get(this.templateString);
        if (cachedTemplate) {
            this.template = cachedTemplate;
            return;
        }

        try {
            const template = document.createElement('template');
            template.innerHTML = this.templateString;
            this.template = template;
            templateCache.set(this.templateString, template);
        } catch (error) {
            console.error("Failed to parse template string", error);
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

