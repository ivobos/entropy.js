import { FunctionGraphOperation, GraphOperation } from "../graph-operation";
import { GraphObjectProps } from "./object/graph-object";
import { includeMixin } from "../../utils/mixin-utils";

export interface GraphNode { 

    parentObject?: GraphNode;       // root entity doesn't have a parent
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
    accept<T extends FunctionGraphOperation>(this: GraphNode, graphNodeVisitor: T, prevNode?: GraphNode): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 

    toJSON(key: any): any {
        return { };
    }
}

export function graphNodeInit(base: GraphObjectProps): GraphNode {
    const graphNode = base as unknown as GraphNode;
    graphNode.parentObject = base.parent || undefined;
    if (base.parent) base.parent.addChildObject(graphNode);
    graphNode.childObjects = [];
    includeMixin(base as any, GraphNodeMixin);
    return graphNode;
}