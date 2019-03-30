import { PhysicalObject } from "./PhysicalObject";


// TODO rename to GraphOperation
export interface GraphWalk {
    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject): void;
}

export class BaseGraphWalk implements GraphWalk {
    private readonly visitedNodes: PhysicalObject[];

    // TODO: add method that determines if the walk should continue deeper from this node

    constructor() {
        this.visitedNodes = [];
    }

    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject): void {
        this.visitedNodes.push(node);
    };

    getVisitedNodes(): PhysicalObject[] {
        return this.visitedNodes;
    }
}