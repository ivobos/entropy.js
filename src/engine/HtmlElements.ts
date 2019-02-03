import { ComponentMixin, ComponentOptions } from "../container/Component";


interface HtmlElementsOptions extends ComponentOptions {
    element: HTMLElement
}

export class HtmlElements extends ComponentMixin(Object)  {

    private element: HTMLElement;
    private rendererDiv: HTMLElement;
    private debugConsoleDiv: HTMLElement;

    constructor(options: HtmlElementsOptions) {
        super({...options, key: HtmlElements});

        this.element = options.element;
        
        this.rendererDiv = document.createElement('div');
        this.rendererDiv.id = "Canvas.rendererDiv";
        this.rendererDiv.style.position = "absolute";
        this.element.appendChild(this.rendererDiv);

        var obsDiv = document.createElement('div');
        obsDiv.style.display = "flex";
        obsDiv.style.paddingLeft = "4px";
        obsDiv.style.position = "absolute";
        this.element.appendChild(obsDiv);

        this.debugConsoleDiv = document.createElement('div');
        this.debugConsoleDiv.id = "debug_info_content";
        this.debugConsoleDiv.style.color = "white";
        this.debugConsoleDiv.style.opacity = "0.5";
        this.debugConsoleDiv.style.fontSize = "10px";
        obsDiv.appendChild(this.debugConsoleDiv);
    }

    getRendererDiv() : HTMLElement {
        return this.rendererDiv;
    }

    getDebugConsoleDiv() : HTMLElement {
        return this.debugConsoleDiv;
    }

}