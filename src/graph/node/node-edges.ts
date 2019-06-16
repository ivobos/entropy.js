import { GraphOperation } from "../graph-operation";
import { GraphNodeProps, NodeAspect, GraphNode, NodeAspectCtor } from "./graph-node";
import { includeMixin } from "../../utils/mixin-utils";

export interface EdgeProps {
    edgeProps: true,
    parent?: NodeWithEdges, // root entity doesn't have a parent
}

export function isEdgeProps(prop: GraphNodeProps): prop is EdgeProps {
    return (<EdgeProps>prop).edgeProps === true;
}

export interface NodeWithEdges extends EdgeProps { 

    childObjects: NodeWithEdges[];

    addChildObject(child: NodeWithEdges): void;

    removeChildObject(child: NodeWithEdges): void;

    // GraphManager calls this to start graph traversal
    // GraphOperation calls this to continue graph traversal
    accept<T extends GraphOperation>(graphOperation: T, prevNode?: NodeWithEdges): T;

    toJSON(key: any): any;

}

export class EdgestMixin { 

    addChildObject(this: NodeWithEdges, child: NodeWithEdges): void {
        this.childObjects.push(child);
    }

    removeChildObject(this: NodeWithEdges, child: NodeWithEdges): void {
        this.childObjects.splice(this.childObjects.indexOf(child), 1);
    }

    // GraphManager calls this to start graph traversal
    accept<T extends GraphOperation>(this: NodeWithEdges, graphOperation: T, prevNode?: NodeWithEdges): T {
        graphOperation.visit(this, prevNode);
        for (const child of this.childObjects) {
            if (child !== prevNode) {
                child.accept(graphOperation, this);
            }
        }
        if (this.parent !== undefined && this.parent !== prevNode) {
            this.parent.accept(graphOperation, this);
        }
        return graphOperation;
    } 

    toJSON(this: NodeWithEdges, key: any): any {
        if (this.parent) {
            return { name: (this as any).name, "parent.name": (this.parent as any).name };
        } else {
            return { name: (this as any).name };
        }
    }
}

export function graphNodeInit(graphNode: NodeWithEdges, edgeProps: EdgeProps): NodeWithEdges {
    Object.assign(graphNode, edgeProps);
    if (edgeProps.parent) edgeProps.parent.addChildObject(graphNode);
    includeMixin(graphNode, EdgestMixin);
    graphNode.childObjects = [];
    return graphNode;
}

export class EdgesAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return isEdgeProps(props);
    }

    initGraphNodeAspect(node: GraphNode, props: GraphNodeProps): void {
        graphNodeInit(node, props as EdgeProps);
    }

    dependencies(): NodeAspectCtor[] {
        return [];
    }

}
