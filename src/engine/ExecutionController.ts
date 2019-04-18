import { AbstractComponent } from "../container/AbstractComponent";
import { MainLoop } from "./MainLoop";
import { Monitor } from "../observability/Monitor";
import { HtmlElements } from "./HtmlElements";
import { ComponentOptions } from "../container/Component";

// TODO: when re-gain visibility we know that time is lagged, so lower frame rate and display CATCHING UP ... message 
// TODO: should probably add page visibility at some stage https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
export class ExecutionController extends AbstractComponent {
    
    constructor(options: ComponentOptions) {
        super({...options, key: ExecutionController});
        window.addEventListener('blur', (event: FocusEvent) => this.onBlur(event), false);
        window.addEventListener('focus', (event: FocusEvent) => this.onFocus(event), false);
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this });
    }

    onBlur(event: FocusEvent): void {
        this.resolve(MainLoop).setMaxAllowedFPS(1);
        this.resolve(HtmlElements).showExecutionModeText("UNFOCUSED");
    }
    
    onFocus(event: FocusEvent): void {
        this.resolve(MainLoop).setMaxAllowedFPS(undefined);
        this.resolve(HtmlElements).showExecutionModeText(undefined);
    }
    
}