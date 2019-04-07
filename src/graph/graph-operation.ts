import { GraphNode } from "./node/graph-node";

export type GraphObjectVisitFunction = (currentNode: GraphNode, prevNode?: GraphNode) => void;

export class GraphOperation {

    private readonly visitedNodes: GraphNode[];
    private readonly visitFunction?: GraphObjectVisitFunction;

    constructor(visitFunction?: GraphObjectVisitFunction) {
        this.visitedNodes = [];
        this.visitFunction = visitFunction;
    }

    // GraphNode calls this method when visited
    visit(currentNode: GraphNode, prevNode?: GraphNode): void {
        if (this.visitFunction) this.visitFunction(currentNode, prevNode);
        this.visitedNodes.push(currentNode);
    }
    
    // GraphNode calls this method to continue traversal
    traverse(current: GraphNode, parent: GraphNode, children: GraphNode[], prevNode?: GraphNode): void {
        for (const child of children) {
            if (child !== prevNode) {
                child.accept(this, current);
            }
        }
        if (parent !== current && parent !== prevNode) {
            parent.accept(this, current);
        }
    }

    getVisitedNodes(): GraphNode[] {
        return this.visitedNodes;
    }

}
