import { NodeWithEdges } from "./node-edges";
import { GraphObjectVisitFunction } from "../graph-operation";
import { GraphNodeProps, NodeAspect, GraphNode } from "./graph-node";
import { PhysicsAspect } from "./physics";

export interface CollisionProps {
    collision: true
}

export function isCollisionProps(prop: GraphNodeProps): prop is CollisionProps {
    return (<CollisionProps>prop).collision === true;
}

export interface CollisionObject extends CollisionProps {
    boundingRadius: number;
    object3d: THREE.Group;
    radius: number;
}

export const collisionInit = function(obj: NodeWithEdges, props: CollisionProps): void {
    const collisionObj: CollisionObject = obj as any as CollisionObject;
    Object.assign(collisionObj, props);
    collisionObj.boundingRadius = 0;
}

export const updateBoundingRadius: GraphObjectVisitFunction = function(currentNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
    const thisObject = currentNode as unknown as CollisionObject;
    thisObject.boundingRadius = thisObject.radius;
    for (const childNode of currentNode.childObjects) {
        const childObject = childNode as unknown as CollisionObject;
        const maxDistance = thisObject.object3d.position.distanceTo(childObject.object3d.position) + childObject.boundingRadius;
        thisObject.boundingRadius = Math.max(thisObject.boundingRadius, maxDistance);
    }
}


export class CollisionAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return isCollisionProps(props);
    }

    initGraphNodeAspect(node: GraphNode, props: GraphNodeProps): void {
        collisionInit(node, props as CollisionProps);
    }

    dependencies(): Function[] {
        return [PhysicsAspect];
    }
    
}