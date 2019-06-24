import * as THREE from "three";
import { NodeAspect, GraphNodeProps, GraphNode } from "./graph-node";
import { PhysicalObject } from "./physics";


export interface AutonomyProps {
    autonomy: true
    target?: GraphNode
}

export interface AutonomyObject extends AutonomyProps, PhysicalObject {

}

export class AutonomyAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<AutonomyProps>props).autonomy === true;
    }
    
    initGraphNode(node: GraphNode, props: AutonomyProps): void {
        if (props !== undefined) {
            const collisionObj= node as any as AutonomyObject;
            collisionObj.autonomy = true;
            if (props.target) collisionObj.target = props.target;
        }
    }
    
    simProcessing(simulationTimestepMsec: number, object: AutonomyObject, prevNode?: GraphNode): void {
        if (!object.autonomy) return;
        if (!object.target) return;

        // look at target maintaining ideal up
        const idealUp = object.object3d.position.clone().sub(object.parent!.object3d.position).normalize();
        object.lookAt(object.target.object3d.position, idealUp);

        // move toward target
        const deltaV = object.target.object3d.position.clone().sub(object.object3d.position).multiplyScalar(.0005).add(new THREE.Vector3());
        object.moveWorldDeltaV(deltaV);

        object.dampVelocity();
    }

}