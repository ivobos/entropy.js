import { SimStep } from "../engine/MainLoop";
import { AbstractComponent } from "../container/AbstractComponent";
import { GraphManager } from "./GraphManager";
import { UpdateObjectPhysics } from "./UpdateObjectPhysics";
import { ComponentOptions } from "../container/Component";
import { UpdateObjectSimStep } from "./UpdateObjectSimStep";
import { UpdatePositionWalk } from "./UpdatePositionWalk";


export class SimExecutor extends AbstractComponent implements SimStep {

    constructor(options: ComponentOptions) {
        super({...options, key: SimExecutor});
    }

    simStep(simulationTimestepMsec: number): void {
        this.resolve(GraphManager).execute(new UpdateObjectSimStep(simulationTimestepMsec));
        this.resolve(GraphManager).execute(new UpdatePositionWalk());  
        this.resolve(GraphManager).execute(new UpdateObjectPhysics(simulationTimestepMsec));
    }

}
