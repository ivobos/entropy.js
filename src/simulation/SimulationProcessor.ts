import { SimStep } from "../engine/MainLoop";
import { AbstractComponent } from "../container/AbstractComponent";
import { GraphManager } from "../model/GraphManager";
import { UpdateObjectPhysics } from "../physics/UpdateObjectPhysics";
import { ComponentOptions } from "../container/Component";
import { UpdateObjectSimStep } from "./UpdateObjectSimStep";
import { UpdatePositionWalk } from "../model/UpdatePositionWalk";


export class SimulationProcessor extends AbstractComponent implements SimStep {

    constructor(options: ComponentOptions) {
        super({...options, key: SimulationProcessor});
    }

    simStep(simulationTimestepMsec: number): void {
        this.resolve(GraphManager).execute(new UpdateObjectSimStep(simulationTimestepMsec));
        this.resolve(GraphManager).execute(new UpdatePositionWalk());  
        this.resolve(GraphManager).execute(new UpdateObjectPhysics(simulationTimestepMsec));
    }

}
