import * as time from '../utils/time';
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { MainLoop } from './MainLoop';
import { Monitor } from '../observability/Monitor';
import { HtmlElements } from './HtmlElements';
import { FocusManager as FocusManager } from '../input/FocusManager';
import { CameraManager } from '../rendering/CameraManager';
import { TextureCache } from '../textures/TextureCache';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { GlobalMouseHandler } from '../input/GlobalMouseHandler';
import { ExecutionController } from './ExecutionController';
import { GraphManager } from '../graph/GraphManager';
import { SimulationProcessor, SimulationFunction } from '../graph/SimulationProcessor';
import { InputProcessor, InputHandlerFunction } from '../input/InputProcessor';
import { ProcGen } from '../graph/ProcGen';
import { CollisionAspect } from '../graph/node/collision';
import { SpecialAspect } from '../graph/node/space';
import { PhysicsAspect } from '../graph/node/physics';
import { RenderableAspect } from '../graph/node/presentation';
import { ProcGenAspect } from '../graph/node/procgen';
import { SelectableAspect } from '../graph/node/selection';
import { SimulationAspect } from '../graph/node/simulation';
import { InputHandlingAspect } from '../graph/node/input-handling';
import { GravityAspect } from '../graph/node/gravity';

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
        new Monitor({container: this.container});
        new TextureCache({container: this.container});
        new GlobalKeyboardHandler({ container: this.container});
        new GlobalMouseHandler({ container: this.container});
        const canvas = new HtmlElements({ container: this.container, element: this.parentDiv});
        const mainLoop = new MainLoop({ container: this.container});
        new FocusManager({container: this.container});
        new GraphManager({
            container: this.container,
            nodeAspects: [InputHandlingAspect,
                CollisionAspect, SpecialAspect, PhysicsAspect, ProcGenAspect, SelectableAspect, 
                SimulationAspect, GravityAspect,
                RenderableAspect]
        });
        new CameraManager({container: this.container});
        new GraphicRenderer({container: this.container, parentDiv: canvas.getRendererDiv()}); 
        new ProcGen({container: this.container});
        new ExecutionController({container: this.container});
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