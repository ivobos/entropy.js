
import { AbstractComponent } from "../container/AbstractComponent";
import { GraphManager } from "../graph/GraphManager";
import { UpdateObjectPhysics } from "../physics/UpdateObjectPhysics";
import { ComponentOptions } from "../container/Component";
import { UpdateObjectSimulationStep } from "./UpdateObjectSimulationStep";
import { GraphOperation } from "../graph/graph-operation";
import { updateBoundingRadius } from "../graph/node/object/concerns/collision";
import { updateObjectPosition } from "../graph/node/object/concerns/physics";

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
        const graphManager = this.resolve(GraphManager);
        graphManager.accept(new UpdateObjectSimulationStep(simulationTimestepMsec));
        graphManager.accept(new GraphOperation(updateObjectPosition));
        graphManager.accept(new UpdateObjectPhysics(simulationTimestepMsec));
        for (const simulationFunction of this.simulationFunctions) {
            simulationFunction(simulationTimestepMsec);
        }
        // TODO: traversin this way will not update bounding radius correcly, we have to update it for all'
        // children first and then parents
        this.resolve(GraphManager).accept(new GraphOperation(updateBoundingRadius));
    }

}
