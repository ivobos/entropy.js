
import { Engine } from './Engine';
import * as time from '../utils/time';
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { WorldModel } from './WorldModel';
import { MainLoop, SimulationModule } from './MainLoop';
import { Monitor } from '../observability/Monitor';
import { textureCache } from './globals';
import { HtmlElements } from './HtmlElements';

let static_init_done = false;

export class Builder {

    private container = new Container();
    private simList: SimulationModule[] = [];
    private parentDiv: HTMLElement | null = null;

    addSimulation(cb: (container: Container) => SimulationModule): Builder {
        const sim = cb(this.container);
        this.simList.push(sim);
        return this;
    }

    setElement(parentDiv: HTMLElement | null): Builder {
        this.parentDiv = parentDiv;
        return this;
    }

    build() : Engine {
        if (this.parentDiv === null) {
            throw Error("parentDiv is null");
        }
        if (!static_init_done) {
            time.time_init();
        }
        const canvas = new HtmlElements(this.container, this.parentDiv);
        const graphicRenderer = new GraphicRenderer(this.container, canvas.getRendererDiv());    
        const worldModel = new WorldModel(this.container);
        const mainLoop = new MainLoop(this.container);
        const monitor = new Monitor(this.container);

        for (const sim of this.simList) {
            mainLoop.add(sim);
        }

        monitor.register(mainLoop);
        monitor.register(graphicRenderer);
        monitor.register(worldModel);        
        monitor.register(textureCache);
        const engine = new Engine(this.container);
        return engine;
    }

}