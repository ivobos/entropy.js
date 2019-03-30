
import { PhysicalObject } from "../model/PhysicalObject";
import { BaseGraphWalk } from "../model/GraphWalk";
import { SimStep } from "../engine/MainLoop";


export class UpdateObjectSimStep extends BaseGraphWalk {

    private simulationTimestepMsec: number;
    
    constructor(simulationTimestepMsec: number) {
        super();
        this.simulationTimestepMsec = simulationTimestepMsec;
    }

    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject): void {
        const b = (node as any) as SimStep;
        if (b.simStep) {
            b.simStep(this.simulationTimestepMsec);
        }
    }

}