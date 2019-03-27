import { ComponentMixin, ComponentOptions } from "../container/Component";


interface HtmlElementsOptions extends ComponentOptions {
    element: HTMLElement
}

export class HtmlElements extends ComponentMixin(Object)  {

    private element: HTMLElement;
    private rendererDiv: HTMLElement;
    private debugConsoleDiv: HTMLElement;
    private simPausedDialogDiv: HTMLElement;

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

        this.simPausedDialogDiv = document.createElement('div');
        this.simPausedDialogDiv.innerHTML = "SIMULATION PAUSED";
        // center it as per https://stackoverflow.com/a/36957305
        this.simPausedDialogDiv.style.position = "fixed";
        this.simPausedDialogDiv.style.top = "50%";
        this.simPausedDialogDiv.style.left = "50%";
        this.simPausedDialogDiv.style.transform = "translate(-50%, -50%)";
        this.simPausedDialogDiv.style.color = "white";
        this.simPausedDialogDiv.style.fontFamily = "Impact";
        this.simPausedDialogDiv.style.fontSize = "32px";
        this.simPausedDialogDiv.style.webkitTextStrokeWidth = "1px";
        this.simPausedDialogDiv.style.webkitTextStrokeColor = "black";
        this.simPausedDialogDiv.style.display = "none";
        this.element.appendChild(this.simPausedDialogDiv);   
    }

    getRendererDiv() : HTMLElement {
        return this.rendererDiv;
    }

    getDebugConsoleDiv() : HTMLElement {
        return this.debugConsoleDiv;
    }

    showSimPausedText(enabled: boolean) {
        this.simPausedDialogDiv.style.display = enabled ? "block" : "none";
    }

}