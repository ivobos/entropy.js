import * as time from "../utils/time";
import { HtmlElements } from "../engine/HtmlElements";
import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent'
import { LoopEndStep } from "../engine/MainLoop";
import { AbstractComponent } from "../container/AbstractComponent";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";

const UPDATE_PERIOD_MSEC = 1000;

export interface Observable {
    getMonitorText() : string;
}

export class Monitor extends AbstractComponent implements LoopEndStep {

    private monitorableComponents : Array<Observable> = [];
    private nextUpdateTimeMsec: number = 0;
    private debugConsoleDiv?: HTMLElement = undefined;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: Monitor});
    }    

    init(): void {
        super.init();
        if (process.env.NODE_ENV === "development") {
            //this.toggleDebugConsole(); // in dev mode default to console on
        }
        this.resolve(GlobalKeyboardHandler).registerKey('x' /*'F3'*/, () => this.toggleDebugConsole());
    }

    toggleDebugConsole(): void {
        if (this.debugConsoleDiv) {
            // disable it
            this.debugConsoleDiv.innerHTML = "";
            this.debugConsoleDiv = undefined;
        } else {
            this.debugConsoleDiv = this.resolve(HtmlElements).getDebugConsoleDiv();
            this.nextUpdateTimeMsec = 0;    
        }
    }

    loopEndStep(fps: number, panic: boolean): void {
        if (this.debugConsoleDiv) {
            const currentTimeMsec = time.getMsecTimestamp();
            if (this.nextUpdateTimeMsec === 0 || currentTimeMsec > this.nextUpdateTimeMsec) {
                this.nextUpdateTimeMsec = currentTimeMsec + UPDATE_PERIOD_MSEC;
                let content = "";
                for (const monitorable of this.monitorableComponents) {
                    content += monitorable.getMonitorText() + "<br>";
                }
                this.debugConsoleDiv.innerHTML = content;
            }
        }
    }

    register(component: Observable) {
        if (this.monitorableComponents.includes(component)) {
            throw new Error("component already registered with monitor");
        }
        this.monitorableComponents.push(component);
    }

}
