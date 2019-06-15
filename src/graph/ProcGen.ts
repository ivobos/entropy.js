import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { GraphManager } from "./GraphManager";
import { FunctionGraphOperation } from "./graph-operation";
import { createProcGenVisitor } from "./node/procgen";


export class ProcGen extends AbstractComponent {

    constructor(options: ComponentOptions) {
        super({...options, key: ProcGen});
    }

    generate() {
        const graphManager = this.resolve(GraphManager);
        graphManager.rootAccept(new FunctionGraphOperation(createProcGenVisitor(this.container)));
    }
}