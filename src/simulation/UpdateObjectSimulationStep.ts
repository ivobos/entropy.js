
import { PhysicalObject, SimulationStep } from "../model/PhysicalObject";
import { BaseGraphNodeVisitor } from "../model/BaseGraphNodeVisitor";


export class UpdateObjectSimulationStep extends BaseGraphNodeVisitor {

    private simulationTimestepMsec: number;
    
    constructor(simulationTimestepMsec: number) {
        super();
        this.simulationTimestepMsec = simulationTimestepMsec;
    }

    visit(node: PhysicalObject, prevNode?: PhysicalObject): void {
        const b = (node as any) as SimulationStep;
        if (b.simulationStep) {
            b.simulationStep(this.simulationTimestepMsec);
        }
    }

}