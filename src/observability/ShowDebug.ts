import { SimStep, DrawStep, LoopEndStep } from "../engine/MainLoop";
import { Container, GraphicRenderer } from "../entropy";
import { Monitor } from "./Monitor";
import { AbstractContainable } from "../container/AbstractContainable";

export class ShowDebug extends AbstractContainable implements LoopEndStep {

    constructor(container: Container) {
        super(container, ShowDebug);
    }

    loopEndStep(fps: number, panic: boolean): void {
        this.resolve(Monitor).render_debug(0);
    }
} 