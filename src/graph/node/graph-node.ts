import { GraphOperation } from "../graph-operation";
import { GraphObjectOptions } from "./object/graph-object";

export class GraphNode { 

    // TODO: no-parent should use undefined
    parentObject: GraphNode;       // points to itself if there is no parent
    childObjects: GraphNode[];

    constructor(options: GraphObjectOptions) {
        this.parentObject = options.parent || this;
        this.childObjects = [];
    }

    addChildObject(child: GraphNode): void {
        this.childObjects.push(child);
    }

    // GraphManager calls this to start graph traversal
    // GraphOperation calls this to continue graph traversal
    accept<T extends GraphOperation>(graphNodeVisitor: T, prevNode?: GraphNode): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 

    toJSON(key: any): any {
        return { 
        };
    }
}

export function graphNodeInit(seed: GraphObjectOptions): GraphNode {
    const graphNode = seed as unknown as GraphNode;
    graphNode.parentObject = seed.parent || graphNode;
    graphNode.childObjects = [];
    graphNode.addChildObject = function(child: GraphNode): void {
        this.childObjects.push(child);
    }
    graphNode.accept = function<T extends GraphOperation>(graphNodeVisitor: T, prevNode?: GraphNode): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 
    return graphNode;
}