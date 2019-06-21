import { SpacialObject } from "./node/space";

export type GraphObjectVisitFunction = (currentNode: SpacialObject, prevNode?: SpacialObject) => void;
export type GraphWalkEndFunction = () => void;

export interface GraphOperation {
    visit(currentNode: SpacialObject, prevNode?: SpacialObject): void;
    end(): void;
}

export abstract class AbstractGraphOperation implements GraphOperation {

    abstract visit(currentNode: SpacialObject, prevNode?: SpacialObject): void;

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
    visit(currentNode: SpacialObject, prevNode?: SpacialObject): void {
        if (this.visitFunction) this.visitFunction(currentNode, prevNode);
    }
    
    // GraphManager calls this when operation finishes
    end(): void {
        if (this.endFunction) this.endFunction();
    }
}


