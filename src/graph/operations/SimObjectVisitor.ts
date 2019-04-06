import { GraphObject } from "../object/GraphObject";

export type SimObjectVisitFunction = (currentNode: GraphObject, prevNode?: GraphObject) => void;

// TODO: rename to SimGraphOperation
export class SimObjectVisitor {

    private readonly visitedNodes: GraphObject[];
    private readonly visitFunction?: SimObjectVisitFunction;

    constructor(visitFunction?: SimObjectVisitFunction) {
        this.visitedNodes = [];
        this.visitFunction = visitFunction;
    }

    // SimObject calls this method when visited
    // override this to implement custom visit logic
    visit(currentNode: GraphObject, prevNode?: GraphObject): void {
        if (this.visitFunction) this.visitFunction(currentNode, prevNode);
        this.visitedNodes.push(currentNode);
    }
    
    // SimObject calls this method to continue traversal
    // override this to change traversal 
    traverse(current: GraphObject, parent: GraphObject, children: GraphObject[], prevNode?: GraphObject): void {
        for (const child of children) {
            if (child !== prevNode) {
                child.accept(this, current);
            }
        }
        if (parent !== current && parent !== prevNode) {
            parent.accept(this, current);
        }
    }

    getVisitedNodes(): GraphObject[] {
        return this.visitedNodes;
    }

}
