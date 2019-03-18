import { MainLoop } from "./MainLoop";
import { ComponentMixin, ComponentOptions } from "../container/Component";
import { ObservableMixin } from "../observability/Observable";
import { AbstractComponent } from "../container/AbstractComponent";


export class Engine extends AbstractComponent { 

    constructor(options: ComponentOptions) {
        super({...options, key: Engine});
    }

    start() {
        this.resolve(MainLoop).start();
    }

}
