import { GraphOperation } from "../graph-operation";
import { GraphObjectOptions } from "./object/graph-object";
import { includeMixin } from "../../utils/mixin-utils";

export interface GraphNode { 

    // TODO: no-parent should use undefined
    parentObject: GraphNode;       // points to itself if there is no parent
    childObjects: GraphNode[];

    addChildObject(child: GraphNode): void;

    removeChildObject(child: GraphNode): void;

    // GraphManager calls this to start graph traversal
    // GraphOperation calls this to continue graph traversal
    accept<T extends GraphOperation>(graphNodeVisitor: T, prevNode?: GraphNode): T;

    toJSON(key: any): any;

}

export class GraphNodeMixin { 

    addChildObject(this: GraphNode, child: GraphNode): void {
        this.childObjects.push(child);
    }

    removeChildObject(this: GraphNode, child: GraphNode): void {
        this.childObjects.splice(this.childObjects.indexOf(child), 1);
    }

    // GraphManager calls this to start graph traversal
    // GraphOperation calls this to continue graph traversal
    accept<T extends GraphOperation>(this: GraphNode, graphNodeVisitor: T, prevNode?: GraphNode): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 

    toJSON(key: any): any {
        return { };
    }
}

export function graphNodeInit(seed: GraphObjectOptions): GraphNode {
    const graphNode = seed as unknown as GraphNode;
    graphNode.parentObject = seed.parent || graphNode;
    graphNode.childObjects = [];
    includeMixin(seed as any, GraphNodeMixin);
    return graphNode;
}