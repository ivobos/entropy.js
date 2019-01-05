import * as time from "../utils/time";
import { BaseComponent } from "../container/BaseComponent";
import { Container } from "../container/Container";

const UPDATE_PERIOD_MSEC = 1000;
export const DEBUG_INFO_CONTENT_DIV_ID = "debug_info_content";

export interface Monitorable {
    getMonitorText() : string;
}

export class Monitor extends BaseComponent {

    getAdditionalMonitorText(): string {
        return "";
    }
    
    private monitorableComponents : Array<Monitorable> = [];
    private nextUpdateTimeMsec: number = 0;

    constructor(container: Container) {
        super(container, Monitor);
    }    

    register(component: Monitorable) {
        this.monitorableComponents.push(component);
    }

    render_debug(tick: number) {
        const div = document.getElementById(DEBUG_INFO_CONTENT_DIV_ID);
        if (div) {
            const currentTimeMsec = time.getMsecTimestamp();
            if (this.nextUpdateTimeMsec === 0 || currentTimeMsec > this.nextUpdateTimeMsec) {
                this.nextUpdateTimeMsec = currentTimeMsec + UPDATE_PERIOD_MSEC;
                let content = "";
                for (const monitorable of this.monitorableComponents) {
                    content += monitorable.getMonitorText() + "<br>";
                }
                div.innerHTML = content;
            }
        } else {
            this.nextUpdateTimeMsec = 0;
        }
    }

}
