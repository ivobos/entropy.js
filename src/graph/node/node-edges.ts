import { GraphOperation } from "../graph-operation";
import { GraphNodeProps, NodeAspect, GraphNode, NodeAspectCtor } from "./graph-node";
import { includeMixin } from "../../utils/mixin-utils";

export interface EdgeProps {
    edgeProps: true,
    parent?: NodeWithEdges, // root entity doesn't have a parent
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

export class EdgesAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<EdgeProps>props).edgeProps === true;
    }
    
    initGraphNodeAspect(graphNode: GraphNode, graphNodeProps: GraphNodeProps): void {
        const edgeProps = graphNodeProps as EdgeProps;
        Object.assign(graphNode, edgeProps);
        if (edgeProps.parent) edgeProps.parent.addChildObject(graphNode);
        includeMixin(graphNode, EdgestMixin);
        graphNode.childObjects = [];
    }

    dependencies(): NodeAspectCtor[] {
        return [];
    }

}
