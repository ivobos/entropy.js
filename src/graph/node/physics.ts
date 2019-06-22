import * as THREE from "three";
import { SpacialObject, SpecialAspect } from "./space";
import { GraphNode, GraphNodeProps, NodeAspect, NodeAspectCtor } from "./graph-node";
import { RenderableObj } from "./presentation";
import { includeMixin } from "../../utils/mixin-utils";
import { GRAVITATIONAL_CONSTANT } from "./gravity";

export interface PhysicalObjProps {
    physics: true
    mass: number
    radius: number
    velocity?: THREE.Vector3            // delta of relativePosition
}

export interface PhysicalObject extends RenderableObj, PhysicalObjectMixin, PhysicalObjProps {
    velocity: THREE.Vector3             // delta of relativePosition
    force: THREE.Vector3
}

class PhysicalObjectMixin {

    move(this: PhysicalObject, deltav: THREE.Vector3, deltar: THREE.Vector2): void {
        if (deltav.length() !== 0 || deltar.length() !== 0) {
            this.object3d.rotateY(deltar.x);
            this.object3d.rotateX(deltar.y);
            this.velocity.add(deltav.clone().applyQuaternion(this.object3d.quaternion));
            this.velocity.multiplyScalar(0.95);
        }
    }

    rotate(this: PhysicalObject, deltar: THREE.Vector2): void {

    }

}

export class PhysicsAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<PhysicalObjProps>props).physics === true;
    }
        
    initGraphNode(node: GraphNode, props: GraphNodeProps): void {
        const simObject = node as SpacialObject;
        const physicalObjProps = props as PhysicalObjProps;
        const physicalObject = simObject as PhysicalObject;
        physicalObject.physics = true;
        physicalObject.mass = physicalObjProps.mass;
        physicalObject.radius = physicalObjProps.radius;
        physicalObject.force = new THREE.Vector3();
        includeMixin(physicalObject, PhysicalObjectMixin);
        if (physicalObjProps.velocity) {
            physicalObject.velocity = physicalObjProps.velocity;
        } else {
            const direction = physicalObject.relativePosition.clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
            if (direction.length() === 0) direction.set(-1,0,0);
            const parentPhysicalObject = physicalObject.parent as PhysicalObject;
            physicalObject.velocity = new THREE.Vector3();
            physicalObject.velocity.copy(direction.clone().multiplyScalar(
                Math.sqrt(GRAVITATIONAL_CONSTANT * parentPhysicalObject.mass / physicalObject.relativePosition.length()))
            );
        }
    }
        
    initDeps(): NodeAspectCtor[] {
        return [SpecialAspect];
    }

    simProcessing?(simulationTimestepMsec: number, node: GraphNode, prevNode?: GraphNode): void {
        const timeDeltaSec = simulationTimestepMsec / 1000;
        const physicalObject = node as PhysicalObject;
        physicalObject.velocity.add(physicalObject.force.clone().multiplyScalar(timeDeltaSec / physicalObject.mass)); 
        physicalObject.relativePosition.add(physicalObject.velocity.clone().multiplyScalar(timeDeltaSec));
        physicalObject.force.set(0,0,0);    
    }

}