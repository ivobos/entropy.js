import { PhysicalObject } from "./PhysicalObject";

export interface GraphNodeVisitor {
    visit(node: PhysicalObject, prevNode?: PhysicalObject): void;
}

export class BaseGraphNodeVisitor implements GraphNodeVisitor {
    private readonly visitedNodes: PhysicalObject[];

    // TODO: add method that determines if the walk should continue deeper from this node

    constructor() {
        this.visitedNodes = [];
    }

    visit(node: PhysicalObject, prevNode?: PhysicalObject): void {
        this.visitedNodes.push(node);
    };

    getVisitedNodes(): PhysicalObject[] {
        return this.visitedNodes;
    }
}