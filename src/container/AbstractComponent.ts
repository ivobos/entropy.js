import { ComponentMixin, ComponentOptions } from "./Component";

export abstract class AbstractComponent extends ComponentMixin(Object) {

    constructor(options: ComponentOptions) {
        super({...options});
    }
       
}

