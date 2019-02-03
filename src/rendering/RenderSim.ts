import { SimStep, DrawStep, LoopEndStep } from "../engine/MainLoop";
import { Container, GraphicRenderer } from "../entropy";
import { AbstractComponent } from "../container/AbstractComponent";

export class RenderSim extends AbstractComponent implements DrawStep {

    drawStep(interpolationPercentage: number): void {
        this.resolve(GraphicRenderer).render();
    }

} 