import * as time from '../utils/time';
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { MainLoop } from './MainLoop';
import { Monitor } from '../observability/Monitor';
import { HtmlElements } from './HtmlElements';
import { FocusManager as FocusManager } from '../graph/object/FocusManager';
import { CameraManager } from '../rendering/CameraManager';
import { TextureCache } from '../textures/TextureCache';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { GlobalMouseHandler } from '../input/GlobalMouseHandler';
import { ExecutionController } from './ExecutionController';
import { GraphManager } from '../graph/GraphManager';
import { SimulationProcessor, SimulationFunction } from '../simulation/SimulationProcessor';
import { InputProcessor, InputHandlerFunction } from '../input/InputProcessor';

let static_init_done = false;

export interface Handlers {
    inputHandler?: InputHandlerFunction;
    simulationHandler?: SimulationFunction;
}

export class Builder {

    private container = new Container();
    private parentDiv: HTMLElement | null = null;
    private handlersList: Handlers[] = [];

    addHandlers(handlers: Handlers): Builder {
        this.handlersList.push(handlers);
        return this;
    }

    getContainer(): Container {
        return this.container;
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
        const graphManager = new GraphManager({container: this.container});
        const cameraManager = new CameraManager({container: this.container});
        const graphicRenderer = new GraphicRenderer({container: this.container, parentDiv: canvas.getRendererDiv()});    
        const executionController = new ExecutionController({container: this.container});
        const simulationProcessor = new SimulationProcessor({container: this.container});
        const inputProcessor = new InputProcessor({container: this.container});

        this.container.initComponents();

        for (const handlers of this.handlersList) {
            if (handlers.inputHandler) inputProcessor.registerHandler(handlers.inputHandler);
            if (handlers.simulationHandler) simulationProcessor.registerHandler(handlers.simulationHandler);
        }

        return mainLoop;
    }

}