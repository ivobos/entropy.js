import { SimStep, DrawStep, LoopEndStep } from "../engine/MainLoop";
import { Monitor } from "./Monitor";
import { AbstractComponent } from "../container/AbstractComponent";

export class ShowDebug extends AbstractComponent implements LoopEndStep {

    loopEndStep(fps: number, panic: boolean): void {
        this.resolve(Monitor).render_debug(0);
    }

} 