import { ComponentMixin, ComponentOptions } from "../container/Component";


interface HtmlElementsOptions extends ComponentOptions {
    element: HTMLElement
}

export class HtmlElements extends ComponentMixin(Object)  {

    private element: HTMLElement;
    private rendererDiv: HTMLElement;
    private debugConsoleDiv: HTMLElement;
    private executionModeTextDiv: HTMLElement;
    private crosshairDiv: HTMLElement;

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
        this.debugConsoleDiv.style.opacity = "1";
        this.debugConsoleDiv.style.fontSize = "10px";
        this.debugConsoleDiv.style.fontFamily = "Courier";
        // this.debugConsoleDiv.style.webkitTextStrokeWidth = "1px";
        // this.debugConsoleDiv.style.webkitTextStrokeColor = "black";
        obsDiv.appendChild(this.debugConsoleDiv);

        this.executionModeTextDiv = document.createElement('div');
        this.executionModeTextDiv.innerHTML = "SIMULATION PAUSED";
        // center it as per https://stackoverflow.com/a/36957305
        this.executionModeTextDiv.style.position = "fixed";
        this.executionModeTextDiv.style.top = "50%";
        this.executionModeTextDiv.style.left = "50%";
        this.executionModeTextDiv.style.transform = "translate(-50%, -50%)";
        this.executionModeTextDiv.style.color = "white";
        this.executionModeTextDiv.style.fontFamily = "Impact";
        this.executionModeTextDiv.style.fontSize = "32px";
        this.executionModeTextDiv.style.webkitTextStrokeWidth = "1px";
        this.executionModeTextDiv.style.webkitTextStrokeColor = "black";
        this.executionModeTextDiv.style.display = "none";
        this.element.appendChild(this.executionModeTextDiv);   

        this.crosshairDiv = document.createElement('div');
        this.crosshairDiv.innerHTML = "+";
        // center it as per https://stackoverflow.com/a/36957305
        this.crosshairDiv.style.position = "fixed";
        this.crosshairDiv.style.top = "50%";
        this.crosshairDiv.style.left = "50%";
        this.crosshairDiv.style.transform = "translate(-50%, -50%)";
        this.crosshairDiv.style.color = "gray";
        this.crosshairDiv.style.fontFamily = "Impact";
        this.crosshairDiv.style.fontSize = "16px";
        this.crosshairDiv.style.webkitTextStrokeWidth = "1px";
        this.crosshairDiv.style.webkitTextStrokeColor = "black";
        this.crosshairDiv.style.display = "block";
        this.element.appendChild(this.crosshairDiv);   

    }

    getRendererDiv() : HTMLElement {
        return this.rendererDiv;
    }

    getDebugConsoleDiv() : HTMLElement {
        return this.debugConsoleDiv;
    }

    showExecutionModeText(text?: string) {
        if (text === undefined) {
            this.executionModeTextDiv.style.display = "none";
            this.crosshairDiv.style.display = "block";
        } else {
            this.executionModeTextDiv.innerHTML = text;           
            this.executionModeTextDiv.style.display = "block";
            this.crosshairDiv.style.display = "none";
        }
    }

}