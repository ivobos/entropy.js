import * as time from "../utils/time";
import { HtmlElements } from "../engine/HtmlElements";

import { AbstractComponent } from "../container/AbstractComponent";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { ComponentOptions } from "../container/Component";

const UPDATE_PERIOD_MSEC = 1000;

export interface Observable {
    getMonitorText() : string;
}


export interface MonitorEntry {
    name?: string,
    jsonable?: any,
    observable?: any,
    observableDeprecated?: Observable,
    additionalText?: () => string,
}

export class Monitor extends AbstractComponent {

    private observables : Array<Observable> = [];
    private entries: Array<MonitorEntry> = [];
    private nextUpdateTimeMsec: number = 0;
    private debugConsoleDiv?: HTMLElement = undefined;

    constructor(options: ComponentOptions) {
        super({...options, key: Monitor});
    }    

    init(): void {
        super.init();
        if (process.env.NODE_ENV === "development") {
            //this.toggleDebugConsole(); // in dev mode default to console on
        }
        this.resolve(GlobalKeyboardHandler).registerKey('z' /*'F3'*/, () => this.toggleDebugConsole());
    }

    toggleDebugConsole(): void {
        if (this.debugConsoleDiv) {
            // disable debug
            this.debugConsoleDiv.innerHTML = "";
            this.debugConsoleDiv.style.display = "none";
            this.debugConsoleDiv = undefined;
        } else {
            // enable debug
            this.debugConsoleDiv = this.resolve(HtmlElements).getDebugConsoleDiv();
            this.debugConsoleDiv.style.display = "block";
            this.nextUpdateTimeMsec = 0;    
        }
    }

    updateMonitor(fps: number, panic: boolean): void {
        if (this.debugConsoleDiv) {
            const currentTimeMsec = time.getMsecTimestamp();
            if (this.nextUpdateTimeMsec === 0 || currentTimeMsec > this.nextUpdateTimeMsec) {
                this.nextUpdateTimeMsec = currentTimeMsec + UPDATE_PERIOD_MSEC;
                let content = "";
                for (const observable of this.observables) {
                    content += observable.getMonitorText() + "<br>";
                }
                for (const entry of this.entries) {
                    if (entry.name) content += entry.name + " ";
                    if (entry.jsonable) content += JSON.stringify(entry.jsonable) + " ";
                    if (entry.observable) content += this.getMonitorTextFor(entry.observable) + " ";
                    if (entry.observableDeprecated) content += entry.observableDeprecated.getMonitorText() + " ";
                    if (entry.additionalText) content += entry.additionalText() + " ";
                    content += "<br>";
                }
                this.debugConsoleDiv.innerHTML = content;
            }
        }
    }

    getMonitorTextFor(object: any): string {
        let result = object.constructor.name+"( ";
        for (const key in object) {
            if (typeof object[key] === 'number' || typeof object[key] === 'boolean') {
                result += " , "+key+"="+object[key];
            }
        }
        result += ") ";
        return result;        
    }

    register(observable: Observable) {
        if (this.observables.includes(observable)) {
            throw new Error("component already registered with monitor");
        }
        this.observables.push(observable);
    }

    addEntry(entry: MonitorEntry) {
        if (this.entries.includes(entry)) {
            throw new Error("monitor entry already registered with monitor");
        }
        this.entries.push(entry);
    }

}
