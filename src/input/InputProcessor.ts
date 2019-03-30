import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";


export type InputHandlerFunction = (timestamp: number, frameDelta: number) => void;

export class InputProcessor extends AbstractComponent {

    private inputHandlers: InputHandlerFunction[] = [];

    constructor(options: ComponentOptions) {
        super({...options, key: InputProcessor});
    }

    registerHandler(handler: InputHandlerFunction): void {
        this.inputHandlers.push(handler);
    }

    processInput(timestamp: number, frameDelta: number): void {
        for (const inputHandler of this.inputHandlers) {
            inputHandler(timestamp, frameDelta);
        }
    }
    
}