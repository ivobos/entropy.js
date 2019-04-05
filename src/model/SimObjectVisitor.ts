import { SimObject } from "./SimObject";

export class SimObjectVisitor {

    private readonly visitedNodes: SimObject[];

    constructor() {
        this.visitedNodes = [];
    }

    // SimObject calls this method when visited
    // override this to implement custom visit logic
    visit(currentNode: SimObject, prevNode?: SimObject): void {
        this.visitedNodes.push(currentNode);
    }
    
    // SimObject calls this method to continue traversal
    // override this to change traversal 
    traverse(current: SimObject, parent: SimObject, children: SimObject[], prevNode?: SimObject): void {
        for (const child of children) {
            if (child !== prevNode) {
                child.accept(this, current);
            }
        }
        if (parent !== current && parent !== prevNode) {
            parent.accept(this, current);
        }
    }

    getVisitedNodes(): SimObject[] {
        return this.visitedNodes;
    }

}
