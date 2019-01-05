import * as time from "../utils/time";
import { BaseComponent } from "../container/BaseComponent";
import { Container } from "../container/Container";
import { HtmlElements } from "../engine/HtmlElements";

const UPDATE_PERIOD_MSEC = 1000;

export interface Monitorable {
    getMonitorText() : string;
}

export class Monitor extends BaseComponent {

    getAdditionalMonitorText(): string {
        return "";
    }
    
    private monitorableComponents : Array<Monitorable> = [];
    private nextUpdateTimeMsec: number = 0;
    private debugConsoleDiv: HTMLElement;

    constructor(container: Container) {
        super(container, Monitor);
        this.debugConsoleDiv = this.resolve(HtmlElements).getDebugConsoleDiv();
    }    

    register(component: Monitorable) {
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
