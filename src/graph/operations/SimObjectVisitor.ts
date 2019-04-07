import { GraphNode } from "../node/graph-node";

export type SimObjectVisitFunction = (currentNode: GraphNode, prevNode?: GraphNode) => void;

// TODO: rename to SimGraphOperation
export class SimObjectVisitor {

    private readonly visitedNodes: GraphNode[];
    private readonly visitFunction?: SimObjectVisitFunction;

    constructor(visitFunction?: SimObjectVisitFunction) {
        this.visitedNodes = [];
        this.visitFunction = visitFunction;
    }

    // SimObject calls this method when visited
    // override this to implement custom visit logic
    visit(currentNode: GraphNode, prevNode?: GraphNode): void {
        if (this.visitFunction) this.visitFunction(currentNode, prevNode);
        this.visitedNodes.push(currentNode);
    }
    
    // SimObject calls this method to continue traversal
    // override this to change traversal 
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
