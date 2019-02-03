import * as time from "../utils/time";
import { HtmlElements } from "../engine/HtmlElements";
import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent'

const UPDATE_PERIOD_MSEC = 1000;

export interface Observable {
    getMonitorText() : string;
}

export class Monitor extends AbstractObservableComponent {

    getAdditionalMonitorText(): string {
        return "";
    }
    
    private monitorableComponents : Array<Observable> = [];
    private nextUpdateTimeMsec: number = 0;
    private debugConsoleDiv: HTMLElement;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: Monitor});
        this.debugConsoleDiv = this.resolve(HtmlElements).getDebugConsoleDiv();
    }    

    register(component: Observable) {
        this.monitorableComponents.push(component);
    }

    render_debug(tick: number) {
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
            this.nextUpdateTimeMsec = 0;
        }
    }

}
