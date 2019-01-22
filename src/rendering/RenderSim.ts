import { SimStep, DrawStep, LoopEndStep } from "../engine/MainLoop";
import { Container, GraphicRenderer } from "../entropy";
import { Monitor } from "../observability/Monitor";
import { AbstractContainable } from "../container/AbstractContainable";

export class RenderSim extends AbstractContainable implements DrawStep {

    constructor(container: Container) {
        super(container, RenderSim);
    }

    drawStep(interpolationPercentage: number): void {
        this.resolve(GraphicRenderer).render();
    }

} 