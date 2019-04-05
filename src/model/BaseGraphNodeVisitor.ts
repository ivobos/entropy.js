import { PhysicalObject } from "./PhysicalObject";
import { GraphNode } from "./GraphNode";
import { GraphNodeVisitor } from "./GraphNodeVisitor";

export class BaseGraphNodeVisitor implements GraphNodeVisitor {

    private readonly visitedNodes: PhysicalObject[];

    constructor() {
        this.visitedNodes = [];
    }

    // override this to implement custom visit logic
    visit(currentNode: PhysicalObject, prevNode?: PhysicalObject): void {
        this.visitedNodes.push(currentNode);
    }
    
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

    getVisitedNodes(): PhysicalObject[] {
        return this.visitedNodes;
    }

}
