
import { PhysicalObject } from "../model/PhysicalObject";
import { BaseGraphWalk } from "../model/GraphWalk";
import { SimulationStep } from "./SimulationProcessor";


export class UpdateObjectSimulationStep extends BaseGraphWalk {

    private simulationTimestepMsec: number;
    
    constructor(simulationTimestepMsec: number) {
        super();
        this.simulationTimestepMsec = simulationTimestepMsec;
    }

    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject): void {
        const b = (node as any) as SimulationStep;
        if (b.simulationStep) {
            b.simulationStep(this.simulationTimestepMsec);
        }
    }

}