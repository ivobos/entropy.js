import { NodeAspect, GraphNode, GraphNodeProps, NodeAspectCtor } from "./graph-node";
import { PhysicsAspect, PhysicalObject } from "./physics";
import { includeMixin } from "../../utils/mixin-utils";
import { GraphManager } from "../GraphManager";
import { SpacialObject } from "./space";

export const GRAVITATIONAL_CONSTANT = 6.67E-1;  //  (m/kg)^2 (real one is 6.67E-11)

class GravityMixin {

}

export class GravityAspect implements NodeAspect {

    initGraphNode(node: GraphNode, props: GraphNodeProps): void {
        includeMixin(node, GravityMixin);
    }
        
    initDeps(): NodeAspectCtor[] {
        return [PhysicsAspect];
    }

    // export const addGravityForce: GraphObjectVisitFunction = function(thisNode: SpacialObject, prevNode?: SpacialObject): void {
    //     const graphObject = thisNode as PhysicalObject;
    //     if (thisNode.parent === undefined) return;    // nothing to do for root graph object
    //     const physicalObject = thisNode as PhysicalObject;
    //     const parentPhysicalObject = thisNode.parent as PhysicalObject;
    //     // gravitational force
    //     const force = - G * parentPhysicalObject.mass * physicalObject.mass / physicalObject.relativePosition.lengthSq();
    //     graphObject.force.add(physicalObject.relativePosition.clone().normalize().multiplyScalar(force));
    // }

    simProcessing(simulationTimestepMsec: number, node: GraphNode, prevNode?: GraphNode): void {
        if (node.parent === undefined) return;    // nothing to do for root graph object
        const parent = node.parent as GraphNode;
        // gravitational force
        const force = - GRAVITATIONAL_CONSTANT * parent.mass * node.mass / node.relativePosition.lengthSq();
        node.force.add(node.relativePosition.clone().normalize().multiplyScalar(force));
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
        // graphManager.visit(updatePositionVisitor);
        graphManager.visit(this.updatePotentialParentForcesVisitor.bind(this));
        // find the most appropriate parent
        const entries = Array.from(this.potentialParentForces.entries());
        if (entries.length > 0) {
            const bestParent = entries.reduce((bestParentEntry, currentParentEntry) => bestParentEntry[1] > currentParentEntry[1] ? bestParentEntry : currentParentEntry)[0];
            this.moveObjectToParent(this.rebalanceCandidate, bestParent);
        }
    }

    updateObjectBalanceCandidatesVisitor(thisNode: SpacialObject, prevNode?: SpacialObject): void {
        const graphObject = thisNode as GraphNode;
        if (!this.objectBalanceCandidates.includes(graphObject)) {
            this.objectBalanceCandidates.push(graphObject);
        }
    }

    updatePotentialParentForcesVisitor(thisNode: SpacialObject, prevNode?: SpacialObject): void {
        const potentialParent = thisNode as GraphNode;
        if (potentialParent.mass > this.rebalanceCandidate!.mass) {
            const force = this.calculateGravityForce(potentialParent, this.rebalanceCandidate!);
            this.potentialParentForces.set(potentialParent, force);
        }
    }

    calculateGravityForce(a: PhysicalObject, b: PhysicalObject): number {
        const delta = a.object3d.position.clone().sub(b.object3d.position);
        return GRAVITATIONAL_CONSTANT * a.mass * b.mass / delta.lengthSq();
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
