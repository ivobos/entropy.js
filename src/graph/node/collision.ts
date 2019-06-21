import { SpacialObject } from "./space";
import { GraphObjectVisitFunction } from "../graph-operation";
import { GraphNodeProps, NodeAspect, GraphNode, NodeAspectCtor } from "./graph-node";
import { PhysicsAspect } from "./physics";

export interface CollisionProps {
    collision: true
}

export interface CollisionObject extends CollisionProps {
    boundingRadius: number;
    object3d: THREE.Group;
    radius: number;
}

export const updateBoundingRadius: GraphObjectVisitFunction = function(currentNode: SpacialObject, prevNode?: SpacialObject): void {
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
        return (<CollisionProps>props).collision === true;
    }
    
    initGraphNode(node: GraphNode, props: GraphNodeProps): void {
        if (props !== undefined) {
            const collisionObj: CollisionObject = node as any as CollisionObject;
            collisionObj.collision = true;
            collisionObj.boundingRadius = 0;
        }
    }

    initDeps(): NodeAspectCtor[] {
        return [PhysicsAspect];
    }
    
}