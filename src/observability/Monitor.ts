import * as time from "../utils/time";
import { HtmlElements } from "../engine/HtmlElements";
import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent'
import { LoopEndStep } from "../engine/MainLoop";
import { AbstractComponent } from "../container/AbstractComponent";

const UPDATE_PERIOD_MSEC = 1000;

export interface Observable {
    getMonitorText() : string;
}

export class Monitor extends AbstractComponent implements LoopEndStep {

    private monitorableComponents : Array<Observable> = [];
    private nextUpdateTimeMsec: number = 0;
    private debugConsoleDiv?: HTMLElement;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: Monitor});
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
        } else {
            this.debugConsoleDiv = this.resolve(HtmlElements).getDebugConsoleDiv();
            this.nextUpdateTimeMsec = 0;
        }
    }

    register(component: Observable) {
        if (this.monitorableComponents.includes(component)) {
            throw new Error("component already registered with monitor");
        }
        this.monitorableComponents.push(component);
    }

}
