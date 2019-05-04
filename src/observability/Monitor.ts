import * as time from "../utils/time";
import { HtmlElements } from "../engine/HtmlElements";

import { AbstractComponent } from "../container/AbstractComponent";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { ComponentOptions } from "../container/Component";

const UPDATE_PERIOD_MSEC = 1000;

export interface MonitorEntry {
    initiallySelected?: boolean,
    jsonable?: any,
    showJsonable?: boolean,
    object?: any,
    showObject?: boolean,
    additionalText?: () => string,
    showAdditionalText?: boolean,
}

export class Monitor extends AbstractComponent {

    private entries: Array<MonitorEntry> = [];
    private selectedEntryIndex: number = 1;
    private nextUpdateTimeMsec: number = 0;
    private debugConsoleDiv?: HTMLElement = undefined;

    constructor(options: ComponentOptions) {
        super({...options, key: Monitor});
        this.addMonitorEntry({object: this}); // add entry for self
    }    

    init(): void {
        super.init();
        if (process.env.NODE_ENV === "development") {
            //this.toggleDebugConsole(); // in dev mode default to console on
        }
        this.resolve(GlobalKeyboardHandler).registerKey('z' /*'F3'*/, () => this.toggleDebugConsole());
        this.resolve(GlobalKeyboardHandler).registerKey('n', () => this.selectNextMonitorEntry());
        this.resolve(GlobalKeyboardHandler).registerKey('m', () => this.toggleDisplayModeOfSelectedEntry());
        this.toggleDebugConsole();
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

    selectNextMonitorEntry(): void {
        this.selectedEntryIndex = (this.selectedEntryIndex + 1) % (this.entries.length);
        this.nextUpdateTimeMsec = 0; // for redraw immediatelly
    }

    toggleDisplayModeOfSelectedEntry(): void {
        const selectedEntry = this.entries[this.selectedEntryIndex];
        this.progressModeOfEntry(selectedEntry);
        this.nextUpdateTimeMsec = 0; // for redraw immediatelly
    }

    progressModeOfEntry(entry: MonitorEntry): void {
        // conver to gray code
        let numBits = 0;
        let gray = 0;
        if (entry.object) gray = gray + ((entry.showObject ? 1 : 0) << numBits++);
        if (entry.additionalText) gray = gray + ((entry.showAdditionalText ? 1 : 0) << numBits++);
        // gray to number
        let n = gray ^ (gray >> 1) ^ ( gray >> 2);
        // increment
        n = (n + 1) % (2 ** numBits);
        // number to gray
        gray = n  ^ (n >> 1);
        // gray to attributes
        numBits = 0;
        if (entry.object) entry.showObject = ((gray >> numBits++) & 1) === 1;
        if (entry.additionalText) entry.showAdditionalText = ((gray >> numBits++) & 1) === 1;
    }

    updateMonitor(fps: number, panic: boolean): void {
        if (this.debugConsoleDiv) {
            const currentTimeMsec = time.getMsecTimestamp();
            if (this.nextUpdateTimeMsec === 0 || currentTimeMsec > this.nextUpdateTimeMsec) {
                this.nextUpdateTimeMsec = currentTimeMsec + UPDATE_PERIOD_MSEC;
                let content = "";
                for (const entry of this.entries) {
                    const visible = entry.showAdditionalText === true || entry.showJsonable === true || entry.showObject === true;
                    const selectedEntry = this.entries[this.selectedEntryIndex];
                    // if (visible && this.entries[this.selectedEntryIndex] !== entry) continue; // nothing to show
                    if (selectedEntry === entry) {
                        content += "<b>>";
                        if (!visible) content += this.getEntryName(entry)+" component is selected but has nothing to show, press [m] to toggle display mode of this line, [n] to select next component"; // name of entry only
                    }
                    if (entry.showJsonable && entry.jsonable) content += JSON.stringify(entry.jsonable) + " ";
                    if (entry.showObject && entry.object) content += this.getMonitorTextFor(entry.object) + " ";
                    if (entry.showAdditionalText && entry.additionalText) content += entry.additionalText() + " ";
                    if (selectedEntry === entry) content += "</b>";
                    content += "<br><br>";
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

    addMonitorEntry(monitorEntry: MonitorEntry) {
        if (this.entries.includes(monitorEntry)) {
            throw new Error("monitor entry already registered with monitor");
        }
        this.entries.push(monitorEntry);
        if (monitorEntry.initiallySelected === true) this.selectedEntryIndex = this.entries.length - 1;
    }

    getEntryName(entry: MonitorEntry): string {
        if (entry.object === undefined) throw Error("don't know how to get name");
        return entry.object.constructor.name;
    }
}
