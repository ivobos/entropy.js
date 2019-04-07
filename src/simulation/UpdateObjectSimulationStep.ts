
import { GraphNode } from "../graph/node/graph-node";
import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { SimObject } from "../graph/node/object/concerns/simulation";


export class UpdateObjectSimulationStep extends SimObjectVisitor {

    private simulationTimestepMsec: number;
    
    constructor(simulationTimestepMsec: number) {
        super();
        this.simulationTimestepMsec = simulationTimestepMsec;
    }

    visit(node: GraphNode, prevNode?: GraphNode): void {
        const simObject = (node as any) as SimObject;
        if (simObject.simulationStep) {
            simObject.simulationStep(this.simulationTimestepMsec);
        }
    }

}