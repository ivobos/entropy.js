import { NodeWithEdges } from "./node/node-edges";

export type GraphObjectVisitFunction = (currentNode: NodeWithEdges, prevNode?: NodeWithEdges) => void;
export type GraphWalkEndFunction = () => void;

export interface GraphOperation {
    visit(currentNode: NodeWithEdges, prevNode?: NodeWithEdges): void;
    end(): void;
}

export abstract class AbstractGraphOperation implements GraphOperation {

    abstract visit(currentNode: NodeWithEdges, prevNode?: NodeWithEdges): void;

    abstract end(): void;

}

export class FunctionGraphOperation extends AbstractGraphOperation {

    private readonly visitFunction?: GraphObjectVisitFunction;
    private readonly endFunction?: GraphWalkEndFunction;

    constructor(visitFunction?: GraphObjectVisitFunction, endFunction?: GraphWalkEndFunction) {
        super();
        this.visitFunction = visitFunction;
        this.endFunction = endFunction;
    }

    // GraphNode calls this method when visited
    visit(currentNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        if (this.visitFunction) this.visitFunction(currentNode, prevNode);
    }
    
    // GraphManager calls this when operation finishes
    end(): void {
        if (this.endFunction) this.endFunction();
    }
}


