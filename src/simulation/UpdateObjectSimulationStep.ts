
import { GraphObject } from "../graph/object/GraphObject";
import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { SimObject } from "../graph/object/concerns/simulation";


export class UpdateObjectSimulationStep extends SimObjectVisitor {

    private simulationTimestepMsec: number;
    
    constructor(simulationTimestepMsec: number) {
        super();
        this.simulationTimestepMsec = simulationTimestepMsec;
    }

    visit(node: GraphObject, prevNode?: GraphObject): void {
        const simObject = (node as any) as SimObject;
        if (simObject.simulationStep) {
            simObject.simulationStep(this.simulationTimestepMsec);
        }
    }

}