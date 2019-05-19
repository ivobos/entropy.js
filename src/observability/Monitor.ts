import * as time from "../utils/time";
import { HtmlElements } from "../engine/HtmlElements";

import { AbstractComponent } from "../container/AbstractComponent";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { ComponentOptions } from "../container/Component";

const UPDATE_PERIOD_MSEC = 1000;

export interface MonitorEntry {
    name: string,
    weight?: number,
    opacity?: number,
    infoContent?: (() => string) | string | object,
    debugContent?: (() => string) | string | object,
    shortcuts?: string,
}

const DECREASE_ENTRY_OPACITY_KEY = 'u';
const INCREASE_ENTRY_OPACITY_KEY = 'i';
const REMOVE_SELECTION_KEY = 'h';

export class Monitor extends AbstractComponent {

    private entries: Array<MonitorEntry> = [];
    private selectedEntry?: MonitorEntry;
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
        this.addMonitorEntry({name: this.constructor.name, weight: 0, opacity: .5, 
            infoContent: "[j][k]-next/prev monitor item",
            debugContent: () => "selected:"+(this.selectedEntry === undefined ? "none" : this.selectedEntry.name),
            shortcuts: "["+REMOVE_SELECTION_KEY+"]-unselect monitor item [z]-show/hide overlay"
        });
        this.resolve(GlobalKeyboardHandler).registerKey('z' /*'F3'*/, () => this.toggleDebugConsole());
        this.resolve(GlobalKeyboardHandler).registerKey('j', () => this.selectNextMonitorEntry(+1));
        this.resolve(GlobalKeyboardHandler).registerKey('k', () => this.selectNextMonitorEntry(-1));
        this.resolve(GlobalKeyboardHandler).registerKey(DECREASE_ENTRY_OPACITY_KEY, () => this.changeEntryOpacity(-.2));
        this.resolve(GlobalKeyboardHandler).registerKey(INCREASE_ENTRY_OPACITY_KEY, () => this.changeEntryOpacity(.2));
        this.resolve(GlobalKeyboardHandler).registerKey(REMOVE_SELECTION_KEY, () => this.removeItemSelection());
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

    removeItemSelection(): void {
        this.selectedEntry = undefined;
        this.nextUpdateTimeMsec = 0;    
    }

    selectNextMonitorEntry(offset: number): void {
        let selectedEntryIndex = this.selectedEntry ? this.entries.indexOf(this.selectedEntry) + offset : 
                offset > 0 ? 0 : this.entries.length - 1;
        if (selectedEntryIndex < 0 || selectedEntryIndex >= this.entries.length) {
            this.selectedEntry = undefined;
        } else {
            this.selectedEntry = this.entries[selectedEntryIndex];
        }
        this.nextUpdateTimeMsec = 0; // for redraw immediatelly
    }

    changeEntryOpacity(delta: number): void {
        if (this.selectedEntry) {
            if (this.selectedEntry.opacity === undefined) this.selectedEntry.opacity = 0;
            this.selectedEntry.opacity = this.selectedEntry.opacity + delta;
            this.selectedEntry.opacity = Math.max(0, Math.min(1, this.selectedEntry.opacity));
            this.nextUpdateTimeMsec = 0; // for redraw immediatelly
        }
    }

    updateMonitor(fps: number, panic: boolean): void {
        if (this.debugConsoleDiv) {
            const currentTimeMsec = time.getMsecTimestamp();
            if (this.nextUpdateTimeMsec === 0 || currentTimeMsec > this.nextUpdateTimeMsec) {
                this.nextUpdateTimeMsec = currentTimeMsec + UPDATE_PERIOD_MSEC;
                let content = "";
                for (const entry of this.entries) {
                    const selected = (this.selectedEntry === entry);
                    const opacity = (entry.opacity ? entry.opacity : 0) + (this.selectedEntry !== undefined ? .1 : 0) + (selected ? .4 : 0);
                    content += "<div style=\"opacity: "+opacity+"\">";
                    if (selected) content += "<b>>";
                    content += entry.name;
                    if (entry.infoContent) content += " "+this.contentToString(entry.infoContent) + " ";
                    if (this.selectedEntry !== undefined && entry.debugContent) content += " "+this.contentToString(entry.debugContent) + " ";
                    if (this.selectedEntry !== undefined && entry.shortcuts) content += " "+entry.shortcuts;
                    if (selected) content += " opacity:"+entry.opacity+" ["+DECREASE_ENTRY_OPACITY_KEY+"]/["+INCREASE_ENTRY_OPACITY_KEY+"]-dec/inc opacity";
                    if (selected) content += "</b>";
                    content += "</div>";
                    content += "<br><br>";
                }
                this.debugConsoleDiv.innerHTML = content;
            }
        }
    }

    contentToString(content: (() => string) | string | object): string {
        if (typeof content === "string") return content;
        if (typeof content === "function") return content();
        return this.getMonitorTextFor(content);
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
        this.entries.sort(function(a,b) {
            return (a.weight === undefined ? Number.MAX_VALUE : a.weight) - 
                    (b.weight === undefined ? Number.MAX_VALUE : b.weight);
        });
    }

    getEntryName(entry: MonitorEntry): string {
        if (entry.infoContent === "string" || entry.infoContent === "function") return "don't know how to get name";
        const obj = entry.infoContent as object;
        return obj.constructor.name;
    }
}
