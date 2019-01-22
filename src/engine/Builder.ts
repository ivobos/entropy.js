
import { Engine } from './Engine';
import * as time from '../utils/time';
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { WorldModel } from './WorldModel';
import { MainLoop, SimStep, DrawStep, LoopEndStep, LoopStartStep } from './MainLoop';
import { Monitor } from '../observability/Monitor';
import { textureCache, globalKeyHandler } from './globals';
import { HtmlElements } from './HtmlElements';

let static_init_done = false;

export class Builder {

    private container = new Container();
    private parentDiv: HTMLElement | null = null;
    private loopStartSteps: LoopStartStep[] = [];
    private simSteps: SimStep[] = [];
    private drawSteps: DrawStep[] = [];
    private loopEndSteps: LoopEndStep[] = [];

    getContainer() : Container {
        return this.container;
    }

    addLoopStartStep(loopStartStep: LoopStartStep): Builder {
        this.loopStartSteps.push(loopStartStep);
        return this;
    }

    addSimStep(simUpdate: SimStep): Builder {
        this.simSteps.push(simUpdate);
        return this;
    }

    addDrawStep(drawStep: DrawStep): Builder {
        this.drawSteps.push(drawStep);
        return this;
    }

    addLoopEndStep(loopEndStep: LoopEndStep): Builder {
        this.loopEndSteps.push(loopEndStep);
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

        for (const loopStartStep of this.loopStartSteps) {
            mainLoop.addLoopStartStep(loopStartStep);
        }
        for (const simUpdate of this.simSteps) {
            mainLoop.addSimStep(simUpdate);
        }
        for (const drawStep of this.drawSteps) {
            mainLoop.addDrawStep(drawStep);
        }
        for (const loopEndStep of this.loopEndSteps) {
            mainLoop.addLoopEndStep(loopEndStep);
        }

        monitor.register(mainLoop);
        monitor.register(graphicRenderer);
        monitor.register(worldModel);        
        monitor.register(textureCache);
        monitor.register(globalKeyHandler);
        const engine = new Engine(this.container);
        return engine;
    }

}