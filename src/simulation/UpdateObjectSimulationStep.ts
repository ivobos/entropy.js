
import { GraphNode } from "../graph/node/graph-node";
import { GraphOperation } from "../graph/graph-operation";
import { SimObject } from "../graph/node/object/concerns/simulation";


export class UpdateObjectSimulationStep extends GraphOperation {

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