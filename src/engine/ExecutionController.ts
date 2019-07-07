import { AbstractComponent } from "../container/AbstractComponent";
import { MainLoop } from "./MainLoop";
import { Monitor } from "../observability/Monitor";
import { HtmlElements } from "./HtmlElements";
import { ComponentOptions } from "../container/Component";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { GraphManager } from "../graph/GraphManager";

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
        const mainLoop = this.resolve(MainLoop);
        const keyboard = this.resolve(GlobalKeyboardHandler);
        keyboard.registerKey('9', () => mainLoop.updateClockMultiplier(.5));
        keyboard.registerKey('0', () => mainLoop.updateClockMultiplier(2.));
        keyboard.registerKey('p', () => mainLoop.togglePauseSimulation());
        this.resolve(Monitor).addMonitorEntry({ name: this.constructor.name, 
            shortcuts: "[p]-pause, [9]-speedup clock, [0]-slower clock" });
    }

    onBlur(event: FocusEvent): void {
        this.resolve(MainLoop).setMaxAllowedFPS(1);
        this.resolve(HtmlElements).showExecutionModeText(""); // "UNFOCUSED");
        this.resolve(GraphManager).getCameraHolder()!.getAudioListener().setMasterVolume(0);
    }
    
    onFocus(event: FocusEvent): void {
        this.resolve(MainLoop).setMaxAllowedFPS(undefined);
        this.resolve(HtmlElements).showExecutionModeText(undefined);
        this.resolve(GraphManager).getCameraHolder()!.getAudioListener().setMasterVolume(1);
    }
    
}