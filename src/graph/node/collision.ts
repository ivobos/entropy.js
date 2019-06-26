import { GraphNodeProps, NodeAspect, GraphNode, NodeAspectCtor } from "./graph-node";
import { PhysicsAspect, PhysicalObject } from "./physics";

export interface CollisionProps {
    collision: true
}

export interface CollisionObject extends CollisionProps {

}

export class CollisionAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<CollisionProps>props).collision === true;
    }
    
    initGraphNode(node: GraphNode, props: GraphNodeProps): void {
        if (props !== undefined) {
            const collisionObj: CollisionObject = node as any as CollisionObject;
            collisionObj.collision = true;
        }
    }

    initDeps(): NodeAspectCtor[] {
        return [PhysicsAspect];
    }
    
    simProcessing(simulationTimestepMsec: number, object: PhysicalObject, prevNode?: GraphNode): void {
        if (object.parent === undefined) return;    // nothing to do for root parent object?
        const parentPhysicalObject = object.parent as PhysicalObject;
        this.checkCollision(object, parentPhysicalObject);
        for (const otherObject of parentPhysicalObject.childObjects) {
            if (object !== otherObject) this.checkCollision(object, otherObject as PhysicalObject);
        }
    }

    checkCollision(thisObject: PhysicalObject, otherObject: PhysicalObject): void {
        // thisObject--->otherObject vector
        const posDelta = thisObject.object3d.position.clone().sub(otherObject.object3d.position);
        // overlap of the two objects 
        const overlap = otherObject.radius + thisObject.radius - posDelta.length();
        if (overlap > 0) {
            // calculate plane of collision
            const collisionPlaneNormal = posDelta.clone().normalize();
            // if this object moving closer to other then reflect velocity perpendicular to plane of collision
            if (collisionPlaneNormal.clone().dot(thisObject.velocity) < 0) {
                thisObject.velocity.reflect(collisionPlaneNormal)
            }
        }        
    }

}