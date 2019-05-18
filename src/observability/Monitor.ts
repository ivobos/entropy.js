import * as time from "../utils/time";
import { HtmlElements } from "../engine/HtmlElements";

import { AbstractComponent } from "../container/AbstractComponent";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { ComponentOptions } from "../container/Component";

const UPDATE_PERIOD_MSEC = 1000;

export interface MonitorEntry {
    name: string,
    weight?: number,
    visible?: boolean,
    content?: (() => string) | string | object,
    shortcuts?: string,
}

export class Monitor extends AbstractComponent {

    private entries: Array<MonitorEntry> = [];
    private selectedEntry?: MonitorEntry;
    private nextUpdateTimeMsec: number = 0;
    private debugConsoleDiv?: HTMLElement = undefined;
    private showShortucts = false;

    constructor(options: ComponentOptions) {
        super({...options, key: Monitor});
    }    

    init(): void {
        super.init();
        if (process.env.NODE_ENV === "development") {
            //this.toggleDebugConsole(); // in dev mode default to console on
        }
        this.addMonitorEntry({name: this.constructor.name, weight: 0, visible: true, 
            content: "[h]-show help/shortcuts",
            shortcuts: "[z]-show/hide overlay [j][k]-next/prev item [x]-toggle visibility of item"
        });
        this.resolve(GlobalKeyboardHandler).registerKey('z' /*'F3'*/, () => this.toggleDebugConsole());
        this.resolve(GlobalKeyboardHandler).registerKey('j', () => this.selectNextMonitorEntry(+1));
        this.resolve(GlobalKeyboardHandler).registerKey('k', () => this.selectNextMonitorEntry(-1));
        this.resolve(GlobalKeyboardHandler).registerKey('x', () => this.showHideSelectedEntry());
        this.resolve(GlobalKeyboardHandler).registerKey('h', () => this.toggleShortcutsDisplay());
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

    toggleShortcutsDisplay(): void {
        this.showShortucts = !this.showShortucts;
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

    showHideSelectedEntry(): void {
        if (this.selectedEntry) {
            this.selectedEntry.visible = !this.selectedEntry.visible;
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
                    const visible = entry.visible;
                    const selected = (this.selectedEntry === entry);
                    if (selected) content += "<b>>";
                    if (selected || (this.showShortucts && entry.shortcuts)) content += entry.name;
                    if (selected && !visible) content += " hidden";
                    if (visible && entry.content) content += " "+this.contentToString(entry.content) + " ";
                    if (selected && visible) content += " [x]-hide";
                    if (selected && !visible) content += " [x]-show";
                    if (this.showShortucts && entry.shortcuts) content += " "+entry.shortcuts;
                    if (selected) content += "</b>";
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
        if (entry.content === "string" || entry.content === "function") return "don't know how to get name";
        const obj = entry.content as object;
        return obj.constructor.name;
    }
}
