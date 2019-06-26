import * as THREE from "three";
import { GraphOperation } from "../graph-operation";
import { GraphNodeProps, NodeAspect, GraphNode } from "./graph-node";
import { includeMixin } from "../../utils/mixin-utils";

export interface SpacialProps {
    space: true,
    parent?: SpacialObject,             // root entity doesn't have a parent
    relativePosition: THREE.Vector3;    // position relative to parent, vector from parent to this in parent's reference frame
}

export interface SpacialObject extends SpacialProps { 

    object3d: THREE.Group;
    childObjects: SpacialObject[];

    addChildObject(child: SpacialObject): void;
    removeChildObject(child: SpacialObject): void;
    // GraphManager calls this to start graph traversal
    // GraphOperation calls this to continue graph traversal
    accept<T extends GraphOperation>(graphOperation: T, prevNode?: SpacialObject): T;
    toJSON(key: any): any;

}

export class SpacialObjectMixin { 

    addChildObject(this: SpacialObject, child: SpacialObject): void {
        this.childObjects.push(child);
    }

    removeChildObject(this: SpacialObject, child: SpacialObject): void {
        if (!this.childObjects.includes(child)) {
            throw Error("requesting to remove child that is not here");
        }
        this.childObjects.splice(this.childObjects.indexOf(child), 1);
    }

    // GraphManager calls this to start graph traversal
    accept<T extends GraphOperation>(this: SpacialObject, graphOperation: T, prevNode?: SpacialObject): T {
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

    toJSON(this: SpacialObject, key: any): any {
        if (this.parent) {
            return { name: (this as any).name, "parent.name": (this.parent as any).name };
        } else {
            return { name: (this as any).name };
        }
    }
}

export class SpacialAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<SpacialProps>props).space === true;
    }
    
    initGraphNode(graphNode: GraphNode, graphNodeProps: GraphNodeProps): void {
        const spacialObject = graphNode as SpacialObject;
        const edgeProps = graphNodeProps as SpacialProps;
        spacialObject.parent = edgeProps.parent;
        spacialObject.relativePosition = edgeProps.relativePosition;
        spacialObject.object3d = new THREE.Group();        // object is a THREE.GROUP
        if (edgeProps.parent) {
            edgeProps.parent.addChildObject(graphNode);
            spacialObject.object3d.position.copy(edgeProps.parent!.object3d.position.clone().add(edgeProps.relativePosition));
        }
        includeMixin(graphNode, SpacialObjectMixin);
        graphNode.childObjects = [];
    }

    simProcessing?(simulationTimestepMsec: number, graphObject: GraphNode, prevNode?: GraphNode): void {
        if (!prevNode) {
            graphObject.object3d.position.set(0,0,0);
        } else if (graphObject.parent === prevNode) {
            const prevObject3d = prevNode.object3d;
            graphObject.object3d.position.copy(prevObject3d.position)
                .add(graphObject.relativePosition);
        } else {
            const prevGraphObject = prevNode as GraphNode;
            graphObject.object3d.position
                .copy(prevGraphObject.relativePosition)
                .negate()
                .add(prevGraphObject.object3d.position);
        }
    }
    
}
