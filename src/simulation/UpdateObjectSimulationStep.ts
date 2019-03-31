
import { PhysicalObject, SimulationStep } from "../model/PhysicalObject";
import { BaseGraphWalk } from "../model/GraphWalk";


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