import { Engine } from './Engine';
import * as time from '../utils/time';
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { WorldModel } from './WorldModel';
import { MainLoop, SimStep, BeforeDrawStep, DrawStep, LoopEndStep, LoopStartStep } from './MainLoop';
import { Monitor } from '../observability/Monitor';
import { textureCache, globalKeyHandler } from './globals';
import { HtmlElements } from './HtmlElements';
import { FocusManager as FocusManager } from '../model/FocusManager';
import { CameraManager } from '../rendering/CameraManager';
import { SceneManager } from '../rendering/SceneManager';

let static_init_done = false;

export class Builder {

    private container = new Container();
    private parentDiv: HTMLElement | null = null;
    private loopStartSteps: LoopStartStep[] = [];
    private simSteps: SimStep[] = [];
    private beforeDrawSteps: BeforeDrawStep[] = [];
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

    addBeforeDrawStep(beforeDrawStep: BeforeDrawStep): Builder {
        this.beforeDrawSteps.push(beforeDrawStep);
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
        const canvas = new HtmlElements({ container: this.container, element: this.parentDiv});
        const worldModel = new WorldModel({ container: this.container });
        const mainLoop = new MainLoop({ container: this.container});
        const monitor = new Monitor({container: this.container});
        const focusManager = new FocusManager({container: this.container});
        const cameraManager = new CameraManager({container: this.container});
        const sceneManager = new SceneManager({container: this.container});
        const graphicRenderer = new GraphicRenderer({container: this.container, parentDiv: canvas.getRendererDiv()});    

        for (const loopStartStep of this.loopStartSteps) {
            mainLoop.addLoopStartStep(loopStartStep);
        }
        for (const simUpdate of this.simSteps) {
            mainLoop.addSimStep(simUpdate);
        }

        for (const beforeDrawStep of this.beforeDrawSteps) {
            mainLoop.addBeforeDrawStep(beforeDrawStep);
        }
        mainLoop.addBeforeDrawStep(sceneManager);
        mainLoop.addBeforeDrawStep(focusManager);

        for (const drawStep of this.drawSteps) {
            mainLoop.addDrawStep(drawStep);
        }
        mainLoop.addDrawStep(graphicRenderer);

        for (const loopEndStep of this.loopEndSteps) {
            mainLoop.addLoopEndStep(loopEndStep);
        }
        mainLoop.addLoopEndStep(monitor);
        
        const engine = new Engine({ container: this.container});
        monitor.register(mainLoop);
        monitor.register(graphicRenderer);
        monitor.register(worldModel);        
        monitor.register(textureCache);
        monitor.register(globalKeyHandler);
        monitor.register(engine);
        monitor.register(focusManager);
        monitor.register(cameraManager);

        return engine;
    }

}