import { NodeWithEdges, EdgesAspect } from "./node-edges";
import * as THREE from "three";
import { GraphNode, GraphNodeProps, NodeAspect, NodeAspectCtor } from "./graph-node";
import { RenderableObj } from "./presentation";
import { GraphObjectVisitFunction } from "../graph-operation";
import { includeMixin } from "../../utils/mixin-utils";
import { GraphManager } from "../GraphManager";

const G = 6.67E-1;  //  (m/kg)^2 (real one is 6.67E-11)

export interface PhysicalObjProps {
    physics: true
    name: string
    velocity?: THREE.Vector3             // delta of relativePosition
    onSurface?: boolean
    mass: number;
    radius: number;
    relativePosition: THREE.Vector3;    // position relative to parent, vector from parent to this in parent's reference frame
}

export function isPhysicsProps(prop: GraphNodeProps): prop is PhysicalObjProps {
    return (<PhysicalObjProps>prop).physics === true;
}

export interface PhysicalObject extends RenderableObj, PhysicalObjectMixin, PhysicalObjProps {
    name: string,
    velocity: THREE.Vector3             // delta of relativePosition
    relativePosition: THREE.Vector3;    // position relative to parent, vector from parent to this in parent's reference frame
    radius: number;
    force: THREE.Vector3;
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

export function physicsInit(simObject: NodeWithEdges, physicalObjProps: PhysicalObjProps): void {
    const physicalObject = simObject as PhysicalObject;
    physicalObject.name = physicalObjProps.name;
    physicalObject.relativePosition = physicalObjProps.relativePosition || new THREE.Vector3();
    physicalObject.mass = physicalObjProps.mass;
    physicalObject.radius = physicalObjProps.radius;
    physicalObject.force = new THREE.Vector3();
    includeMixin(physicalObject, PhysicalObjectMixin);
    physicalObject.velocity = physicalObjProps.velocity ? physicalObjProps.velocity : new THREE.Vector3(0,0,0);
    if (physicalObject.parent !== undefined && !physicalObjProps.onSurface) {
        const direction = physicalObject.relativePosition.clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
        if (direction.length() === 0) direction.set(-1,0,0);
        const parentPhysicalObject = physicalObject.parent as PhysicalObject;
        physicalObject.velocity.copy(direction.clone().multiplyScalar(
            Math.sqrt(G * parentPhysicalObject.mass / physicalObject.relativePosition.length()))
        );
    }
}

export const updatePositionVisitor: GraphObjectVisitFunction = function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
    const graphObject = thisNode as GraphNode;
    if (!prevNode) {
        graphObject.object3d.position.set(0,0,0);
    } else if (thisNode.parent === prevNode) { // TODO: not clear if this is correct
        const prevObject3d = (prevNode as PhysicalObject).object3d;
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

export const resetForceVector: GraphObjectVisitFunction = function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
    const graphObject = thisNode as PhysicalObject;
    graphObject.force.set(0,0,0);
}

export const addGravityForce: GraphObjectVisitFunction = function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
    const graphObject = thisNode as PhysicalObject;
    if (thisNode.parent === undefined) return;    // nothing to do for root graph object
    const physicalObject = thisNode as PhysicalObject;
    const parentPhysicalObject = thisNode.parent as PhysicalObject;
    // gravitational force
    const force = - G * parentPhysicalObject.mass * physicalObject.mass / physicalObject.relativePosition.lengthSq();
    graphObject.force.add(physicalObject.relativePosition.clone().normalize().multiplyScalar(force));
}

export function getUpdateVelocityAndPositionVisitor(simulationTimestepMsec: number): GraphObjectVisitFunction {
    const timeDeltaSec = simulationTimestepMsec / 1000;
    return function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        const physicalObject = thisNode as PhysicalObject;
        physicalObject.velocity.add(physicalObject.force.clone().multiplyScalar(timeDeltaSec / physicalObject.mass)); 
        physicalObject.relativePosition.add(physicalObject.velocity.clone().multiplyScalar(timeDeltaSec));
    }
}

export const addCollisionForces: GraphObjectVisitFunction = function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
    if (thisNode.parent === undefined) return;    // nothing to do for root parent object?
    const physicalObject = thisNode as PhysicalObject;
    const parentPhysicalObject = thisNode.parent as PhysicalObject;
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

    objectBalanceCandidates: GraphNode[] = [];
    rebalanceCandidate?: GraphNode;
    potentialParentForces:Map<GraphNode,number> = new Map();

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

    updateObjectBalanceCandidatesVisitor(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        const graphObject = thisNode as GraphNode;
        if (!this.objectBalanceCandidates.includes(graphObject)) {
            this.objectBalanceCandidates.push(graphObject);
        }
    }

    updatePotentialParentForcesVisitor(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        const potentialParent = thisNode as GraphNode;
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
        if (childObject.parent !== newParent) {
//            console.log("reparenting "+childObject.name+" to "+newParent.name);
            if (childObject.parent !== undefined) childObject.parent.removeChildObject(childObject);
            newParent.addChildObject(childObject);
            childObject.parent = newParent;
            childObject.relativePosition = childObject.object3d.position.clone().sub(newParent.object3d.position);
        }
    }
}

export class PhysicsAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return isPhysicsProps(props);
    }
    
    initGraphNodeAspect(node: GraphNode, props: GraphNodeProps): void {
        physicsInit(node, props as PhysicalObjProps);
    }

    dependencies(): NodeAspectCtor[] {
        return [EdgesAspect];
    }
    
}