import { AbstractComponent } from "../container/AbstractComponent";
import { LoopStartStep, MainLoop } from "./MainLoop";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";



export class EngineController extends AbstractComponent implements LoopStartStep {
    
    init() {
        
    }

    loopStartStep(timestamp: number, frameDelta: number): void {

    }

}