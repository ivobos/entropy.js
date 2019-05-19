import { GraphNode } from "../../graph-node";
import * as THREE from "three";
import { GraphObjectOptions, GraphObjectInitFunction, GraphObject } from "../graph-object";
import { RenderableObject } from "./presentation";
import { GraphObjectVisitFunction } from "../../../graph-operation";
import { includeMixin } from "../../../../utils/mixin-utils";

const G = 6.67E-4;  //  (m/kg)^2 (real one is 6.67E-11)

export interface PhysicalObject extends RenderableObject {
    velocity: THREE.Vector3;            // delta of relativePosition
    relativePosition: THREE.Vector3;    // position relative to parent, vector from parent to this in parent's reference frame
    mass: number;
    radius: number;
    force: THREE.Vector3;

    move(deltav: THREE.Vector3, deltar: THREE.Vector2): void;
    setOrbitVelocity(direction: THREE.Vector3): void;
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

    /**
     * @param direction if the length < 1 then the velocity will be sub-orbit, if > 1 then it will be exit velocity
     */
    setOrbitVelocity(this: PhysicalObject, direction: THREE.Vector3): void {
        const parentPhysicalObject = this.parentObject as PhysicalObject;
        this.velocity.copy(direction.clone().multiplyScalar(
            Math.sqrt(G * parentPhysicalObject.mass / this.relativePosition.length()))
        );
    }
}

export const physicalObjectInit: GraphObjectInitFunction = function(simObject: GraphNode, options: GraphObjectOptions): void {
    const physicalObject = simObject as PhysicalObject;
    physicalObject.relativePosition = options.initialRelativePosition || new THREE.Vector3();
    physicalObject.mass = options.mass;
    physicalObject.radius = options.radius;
    physicalObject.velocity = options.initialVelocity || new THREE.Vector3(0,0,0);
    physicalObject.force = new THREE.Vector3();
    includeMixin(physicalObject, PhysicalObjectMixin);
}

export const updatePositionVisitor: GraphObjectVisitFunction = function(thisNode: GraphNode, prevNode?: GraphNode): void {
    const graphObject = thisNode as GraphObject;
    if (!prevNode) {
        graphObject.object3d.position.set(0,0,0);
    } else if (thisNode.parentObject === prevNode) {
        const prevObject3d = (prevNode as PhysicalObject).object3d;
        graphObject.object3d.position.copy(prevObject3d.position)
            .add(graphObject.relativePosition);
    } else {
        const prevGraphObject = prevNode as GraphObject;
        graphObject.object3d.position
            .copy(prevGraphObject.relativePosition)
            .negate()
            .add(prevGraphObject.object3d.position);
    }
}

export const resetForceVector: GraphObjectVisitFunction = function(thisNode: GraphNode, prevNode?: GraphNode): void {
    const graphObject = thisNode as PhysicalObject;
    graphObject.force.set(0,0,0);
}

export const addGravityForce: GraphObjectVisitFunction = function(thisNode: GraphNode, prevNode?: GraphNode): void {
    const graphObject = thisNode as PhysicalObject;
    if (thisNode.parentObject == thisNode) return;
    const physicalObject = thisNode as PhysicalObject;
    const parentPhysicalObject = thisNode.parentObject as PhysicalObject;
    // gravitational force
    const force = - G * parentPhysicalObject.mass * physicalObject.mass / physicalObject.relativePosition.lengthSq();
    graphObject.force.add(physicalObject.relativePosition.clone().normalize().multiplyScalar(force));
}

export function getUpdateVelocityAndPositionVisitor(simulationTimestepMsec: number): GraphObjectVisitFunction {
    const timeDeltaSec = simulationTimestepMsec / 1000;
    return function(thisNode: GraphNode, prevNode?: GraphNode): void {
        const physicalObject = thisNode as PhysicalObject;
        physicalObject.velocity.add(physicalObject.force.clone().multiplyScalar(timeDeltaSec / physicalObject.mass)); 
        physicalObject.relativePosition.add(physicalObject.velocity.clone().multiplyScalar(timeDeltaSec));
    }
}

export const addCollisionForces: GraphObjectVisitFunction = function(thisNode: GraphNode, prevNode?: GraphNode): void {
    if (thisNode.parentObject == thisNode) return;
    const physicalObject = thisNode as PhysicalObject;
    const parentPhysicalObject = thisNode.parentObject as PhysicalObject;
    const overlap = parentPhysicalObject.radius + physicalObject.radius - physicalObject.relativePosition.length();
    if (overlap > 0) {
        const force = physicalObject.relativePosition.clone().normalize().multiplyScalar(overlap * overlap);
        physicalObject.force.add(force);
    }        
}
