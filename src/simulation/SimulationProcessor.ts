
import { AbstractComponent } from "../container/AbstractComponent";
import { GraphManager } from "../model/GraphManager";
import { UpdateObjectPhysics } from "../physics/UpdateObjectPhysics";
import { ComponentOptions } from "../container/Component";
import { UpdateObjectSimulationStep } from "./UpdateObjectSimulationStep";
import { UpdatePositionWalk } from "../model/UpdatePositionWalk";

export type SimulationFunction = (simulationTimestepMsec: number) => void;

export interface SimulationStep {
    // update simulation
    simulationStep(simulationTimestepMsec: number): void;
}

export class SimulationProcessor extends AbstractComponent {

    private simulationFunctions: SimulationFunction[] = [];

    constructor(options: ComponentOptions) {
        super({...options, key: SimulationProcessor});
    }

    registerHandler(handler: SimulationFunction): void {
        this.simulationFunctions.push(handler);
    }

    processSimulationStep(simulationTimestepMsec: number): void {
        this.resolve(GraphManager).execute(new UpdateObjectSimulationStep(simulationTimestepMsec));
        this.resolve(GraphManager).execute(new UpdatePositionWalk());  
        this.resolve(GraphManager).execute(new UpdateObjectPhysics(simulationTimestepMsec));
        for (const simulationFunction of this.simulationFunctions) {
            simulationFunction(simulationTimestepMsec);
        }
    }

}
