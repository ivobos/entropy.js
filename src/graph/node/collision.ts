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
    
    simProcessing?(simulationTimestepMsec: number, node: GraphNode, prevNode?: GraphNode): void {
        if (node.parent === undefined) return;    // nothing to do for root parent object?
        const physicalObject = node as PhysicalObject;
        const parentPhysicalObject = node.parent as PhysicalObject;
        const overlap = parentPhysicalObject.radius + physicalObject.radius - physicalObject.relativePosition.length();
        if (overlap > 0) {
            const force = physicalObject.relativePosition.clone().normalize().multiplyScalar(1000 * overlap * overlap);
            physicalObject.force.add(force);
            // console.log("overlap of "+overlap);
        }        
    
    }

}