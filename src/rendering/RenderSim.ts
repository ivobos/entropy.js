import { NoopSim } from "../engine/MainLoop";
import { Container, GraphicRenderer } from "../entropy";
import { Monitor } from "../observability/Monitor";


export class RenderSim extends NoopSim {

    constructor(container: Container) {
        super(container, RenderSim);
    }

    draw(interpolationPercentage: number): void {
        this.resolve(GraphicRenderer).render();
    }

    end(fps: number, panic: boolean): void {
        this.resolve(Monitor).render_debug(0);
    }
} 