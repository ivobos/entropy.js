import { GraphNode } from "../../graph-node";
import * as THREE from "three";
import { GraphObjectOptions, GraphObjectInitFunction, GraphObject } from "../graph-object";
import { RenderableObject } from "./presentation";
import { GraphObjectVisitFunction } from "../../../graph-operation";
import { includeMixin } from "../../../../utils/mixin-utils";
import { GraphManager } from "../../../GraphManager";

const G = 6.67E-1;  //  (m/kg)^2 (real one is 6.67E-11)

export interface PhysicalObject extends RenderableObject {
    name: string,
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
    physicalObject.name = options.name;
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
        const force = physicalObject.relativePosition.clone().normalize().multiplyScalar(1000 * overlap * overlap);
        physicalObject.force.add(force);
        // console.log("overlap of "+overlap);
    }        
}

/** 
 * The purpose of this class is to re-balance the graph in such a way that it eventually conforms to the following rules:
 * - all parents should have higher mass than their children
 * - gravitational force exerted on a node by its parent is higher then any other potential parent that node could have
 * 
 * It operates in 3 phases
 * 1. identify an object to balance
 * 2. calculate forces on that object by its potential parents
 * 3. move the object to a new parent as needed
 */
export class GravityGraphBalancer {

    objectBalanceCandidates: GraphObject[] = [];
    rebalanceCandidate?: GraphObject;
    potentialParentForces:Map<GraphObject,number> = new Map();

    balanceOne(graphManager: GraphManager): void {
        // find candidate to balance
        graphManager.visit(this.updateObjectBalanceCandidatesVisitor.bind(this));
        this.rebalanceCandidate = this.objectBalanceCandidates.shift();
        if (this.rebalanceCandidate === undefined) return;
        // calculate gravity forces
        this.potentialParentForces.clear();
        graphManager.visit(updatePositionVisitor);
        graphManager.visit(this.updatePotentialParentForcesVisitor.bind(this));
        // find the most appropriate parent
        const entries = Array.from(this.potentialParentForces.entries());
        if (entries.length > 0) {
            const bestParent = entries.reduce((bestParentEntry, currentParentEntry) => bestParentEntry[1] > currentParentEntry[1] ? bestParentEntry : currentParentEntry)[0];
            this.moveObjectToParent(this.rebalanceCandidate, bestParent);
        }
    }

    updateObjectBalanceCandidatesVisitor(thisNode: GraphNode, prevNode?: GraphNode): void {
        const graphObject = thisNode as GraphObject;
        if (!this.objectBalanceCandidates.includes(graphObject)) {
            this.objectBalanceCandidates.push(graphObject);
        }
    }

    updatePotentialParentForcesVisitor(thisNode: GraphNode, prevNode?: GraphNode): void {
        const potentialParent = thisNode as GraphObject;
        if (potentialParent.mass > this.rebalanceCandidate!.mass) {
            const force = this.calculateGravityForce(potentialParent, this.rebalanceCandidate!);
            this.potentialParentForces.set(potentialParent, force);
        }
    }

    calculateGravityForce(a: PhysicalObject, b: PhysicalObject): number {
        const delta = a.object3d.position.clone().sub(b.object3d.position);
        return G * a.mass * b.mass / delta.lengthSq();
    }

    moveObjectToParent(childObject: PhysicalObject, newParent: PhysicalObject) {
        if (childObject.parentObject !== newParent) {
            // console.log("reparenting "+childObject.name+" to "+newParent.name);
            childObject.parentObject.removeChildObject(childObject);
            newParent.addChildObject(childObject);
            childObject.parentObject = newParent;
            childObject.relativePosition = childObject.object3d.position.clone().sub(newParent.object3d.position);
        }
    }
}
