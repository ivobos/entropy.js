import { AbstractComponent } from "../container/AbstractComponent";
import { LoopStartStep, MainLoop } from "./MainLoop";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { Monitor } from "../observability/Monitor";
import { AbstractObservableComponent, ObservableComponentOptions } from "../container/AbstractObservableComponent";
import { HtmlElements } from "./HtmlElements";


// TODO: should probably add page visibility at some stage https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
export class ExecutionController extends AbstractObservableComponent {
    
    private focused: boolean = true;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: ExecutionController});
        window.addEventListener('blur', (event: FocusEvent) => this.onBlur(event), false);
        window.addEventListener('focus', (event: FocusEvent) => this.onFocus(event), false);
    }

    onBlur(event: FocusEvent): void {
        this.focused = false;
        this.resolve(MainLoop).setMaxAllowedFPS(1);
        this.resolve(HtmlElements).showExecutionModeText("UNFOCUSED");
    }
    
    onFocus(event: FocusEvent): void {
        this.focused = true;
        this.resolve(MainLoop).setMaxAllowedFPS(undefined);
        this.resolve(HtmlElements).showExecutionModeText(undefined);
    }
    
    getAdditionalMonitorText(): string {
        return "";
    }
    
    init(): void {
        super.init();
        this.resolve(Monitor).register(this);
    }

}