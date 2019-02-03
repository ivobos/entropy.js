import { ComponentMixin, ComponentOptions } from "./Component";
import { ObservableMixin, ObserableOptions } from "../observability/Observable";

export interface ObservableComponentOptions extends  ComponentOptions, ObserableOptions {

}

export abstract class AbstractObservableComponent extends ObservableMixin(ComponentMixin(Object)) {

    constructor(options: ObservableComponentOptions) {
        super({...options, obsDetail: () => this.getAdditionalMonitorText()});
    }

    abstract getAdditionalMonitorText(): string;

}
