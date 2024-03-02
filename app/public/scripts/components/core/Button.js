export default class Button {
    constructor(text, onClick, type = "button", className) {
        this.text = text;
        this.onClick = onClick;
        this.type = type;
        this.className = className;
        // this.text = text;
        // this.onClick = onClick;
        // this.type = type || "button";
        // this.className = className;
    }
    render() {
        const button = document.createElement("button");
        button.textContent = this.text;
        button.type = this.type;
        if (this.className) {
            button.className = this.className;
        }
        button.addEventListener("click", this.onClick);
        return button;
    }
}
//# sourceMappingURL=Button.js.map