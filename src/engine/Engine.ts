import { MainLoop } from "./MainLoop";
import { ComponentOptions } from "../container/Component";
import { AbstractComponent } from "../container/AbstractComponent";


export class Engine extends AbstractComponent { 

    constructor(options: ComponentOptions) {
        super({...options, key: Engine});
    }

    start() {
        this.resolve(MainLoop).start();
    }

}
