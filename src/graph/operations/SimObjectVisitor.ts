import { SimObject } from "../object/SimObject";

export type SimObjectVisitFunction = (currentNode: SimObject, prevNode?: SimObject) => void;

// TODO: rename to SimGraphOperation
export class SimObjectVisitor {

    private readonly visitedNodes: SimObject[];
    private readonly visitFunction?: SimObjectVisitFunction;

    constructor(visitFunction?: SimObjectVisitFunction) {
        this.visitedNodes = [];
        this.visitFunction = visitFunction;
    }

    // SimObject calls this method when visited
    // override this to implement custom visit logic
    visit(currentNode: SimObject, prevNode?: SimObject): void {
        if (this.visitFunction) this.visitFunction(currentNode, prevNode);
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
