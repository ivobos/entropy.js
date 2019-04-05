
import { SimObject, SimulationStep } from "../model/SimObject";
import { SimObjectVisitor } from "../model/SimObjectVisitor";


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