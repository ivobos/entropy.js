import { MainLoop } from "./MainLoop";
import { ComponentMixin, ComponentOptions } from "../container/Component";
import { ObservableMixin } from "../observability/Observable";


export class Engine extends ObservableMixin(ComponentMixin(Object)) { 

    constructor(options: ComponentOptions) {
        super({...options, key: Engine, obsDetail: () => this.getAdditionalMonitorText()});
    }

    getAdditionalMonitorText(): string {
        return "test";
    }

    start() {
        this.resolve(MainLoop).start();
    }

}
