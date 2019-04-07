import { GraphNode } from "../../graph-node";
import { GraphObjectVisitFunction } from "../../../graph-operation";
import { GraphObjectInitFunction } from "../graph-object";

export interface ObjectWithBoundingRadius {
    boundingRadius: number;
    object3d: THREE.Group;
    radius: number;
}

export const boundingRadiusInit: GraphObjectInitFunction = function(simObject: GraphNode): void {
    (simObject as unknown as ObjectWithBoundingRadius).boundingRadius = 0;
}

export const updateBoundingRadius: GraphObjectVisitFunction = function(currentNode: GraphNode, prevNode?: GraphNode): void {
    const thisObject = currentNode as unknown as ObjectWithBoundingRadius;
    thisObject.boundingRadius = thisObject.radius;
    for (const childNode of currentNode.childObjects) {
        const childObject = childNode as unknown as ObjectWithBoundingRadius;
        const maxDistance = thisObject.object3d.position.distanceTo(childObject.object3d.position) + childObject.boundingRadius;
        thisObject.boundingRadius = Math.max(thisObject.boundingRadius, maxDistance);
    }
}
