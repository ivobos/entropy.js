
import { AbstractComponent } from "../container/AbstractComponent";
import { GraphManager } from "../graph/GraphManager";
import { UpdateObjectPhysics } from "../physics/UpdateObjectPhysics";
import { ComponentOptions } from "../container/Component";
import { UpdateObjectSimulationStep } from "./UpdateObjectSimulationStep";
import { UpdatePositionWalk } from "../graph/operations/UpdatePositionWalk";
import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { updateBoundingRadius } from "../graph/node/object/concerns/collision";

export type SimulationFunction = (simulationTimestepMsec: number) => void;


export class SimulationProcessor extends AbstractComponent {

    private simulationFunctions: SimulationFunction[] = [];

    constructor(options: ComponentOptions) {
        super({...options, key: SimulationProcessor});
    }

    registerHandler(handler: SimulationFunction): void {
        this.simulationFunctions.push(handler);
    }

    processSimulationStep(simulationTimestepMsec: number): void {
        this.resolve(GraphManager).accept(new UpdateObjectSimulationStep(simulationTimestepMsec));
        this.resolve(GraphManager).accept(new UpdatePositionWalk());  
        this.resolve(GraphManager).accept(new UpdateObjectPhysics(simulationTimestepMsec));
        for (const simulationFunction of this.simulationFunctions) {
            simulationFunction(simulationTimestepMsec);
        }
        // TODO: traversin this way will not update bounding radius correcly, we have to update it for all'
        // children first and then parents
        this.resolve(GraphManager).accept(new SimObjectVisitor(updateBoundingRadius));
    }

}
