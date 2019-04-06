
import { SimObject, SimulationStep } from "../graph/object/SimObject";
import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";


export class UpdateObjectSimulationStep extends SimObjectVisitor {

    private simulationTimestepMsec: number;
    
    constructor(simulationTimestepMsec: number) {
        super();
        this.simulationTimestepMsec = simulationTimestepMsec;
    }

    visit(node: SimObject, prevNode?: SimObject): void {
        const b = (node as any) as SimulationStep;
        if (b.simulationStep) {
            b.simulationStep(this.simulationTimestepMsec);
        }
    }

}