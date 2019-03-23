import { ComponentMixin, ComponentOptions } from "./Component";
import { ObservableMixin, ObserableOptions } from "../observability/Observable";
import { Monitor } from "../observability/Monitor";

export interface ObservableComponentOptions extends  ComponentOptions, ObserableOptions {

}

export abstract class AbstractObservableComponent extends ObservableMixin(ComponentMixin(Object)) {

    constructor(options: ObservableComponentOptions) {
        super({...options, obsDetail: () => this.getAdditionalMonitorText()});
    }

    init(): void {
        super.init();
        this.resolve(Monitor).register(this);
    }

    abstract getAdditionalMonitorText(): string;

}
