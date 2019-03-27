import * as time from '../utils/time';
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { MainLoop, SimStep, BeforeDrawStep, DrawStep, LoopEndStep, LoopStartStep } from './MainLoop';
import { Monitor } from '../observability/Monitor';
import { HtmlElements } from './HtmlElements';
import { FocusManager as FocusManager } from '../model/FocusManager';
import { CameraManager } from '../rendering/CameraManager';
import { SceneManager } from '../rendering/SceneManager';
import { TextureCache } from '../textures/TextureCache';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { GlobalMouseHandler } from '../input/GlobalMouseHandler';
import { ExecutionController } from './ExecutionController';

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

    build() : MainLoop {
        if (this.parentDiv === null) {
            throw Error("parentDiv is null");
        }
        if (!static_init_done) {
            time.time_init();
        }
        const monitor = new Monitor({container: this.container});
        const textureCache = new TextureCache({container: this.container});
        const globalKeyHandler = new GlobalKeyboardHandler({ container: this.container});
        const globalMouseHandler = new GlobalMouseHandler({ container: this.container});
        const canvas = new HtmlElements({ container: this.container, element: this.parentDiv});
        const mainLoop = new MainLoop({ container: this.container});
        const focusManager = new FocusManager({container: this.container});
        const cameraManager = new CameraManager({container: this.container});
        const sceneManager = new SceneManager({container: this.container});
        const graphicRenderer = new GraphicRenderer({container: this.container, parentDiv: canvas.getRendererDiv()});    
        const executionController = new ExecutionController({container: this.container});

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
        
        this.container.initComponents();

        return mainLoop;
    }

}