import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { GraphNode } from "../graph/node/graph-node";
import { G } from "./physics_constants";
import { PhysicalObject } from "../graph/node/object/concerns/physics";

export class UpdateObjectPhysics extends SimObjectVisitor {

    private readonly timeDeltaSec: number;

    constructor(simulationTimestepMsec: number) {
        super();
        this.timeDeltaSec = simulationTimestepMsec / 1000;
    }

    // TODO: how to implement child to child collision
    // TODO: implement re-parenting when gravity from another object is stronger than from parent
    visit(node: GraphNode, prevNode?: GraphNode): void {
        if (node.parentObject == node) return;
        const physicalObject = node as PhysicalObject;
        const parentPhysicalObject = node.parentObject as PhysicalObject;
        // gravitational force
        const force = G * parentPhysicalObject.mass * physicalObject.mass / physicalObject.relativePosition.lengthSq();
        const deltav = physicalObject.relativePosition.clone()     
                            .normalize()
                            .multiplyScalar(- force * this.timeDeltaSec / physicalObject.mass);
                            physicalObject.velocity.add(deltav); // TODO: to conserve linear momentum have to update parentObject.velocity too        
        physicalObject.relativePosition.add(physicalObject.velocity.clone().multiplyScalar(this.timeDeltaSec));
        // intersection
       const overlap = physicalObject.relativePosition.length() - parentPhysicalObject.radius - physicalObject.radius;
       if (overlap < 0) {
            const normal = physicalObject.relativePosition.clone().normalize();
            physicalObject.velocity.reflect(normal);
            // TODO: some energy would be released during reflection
            // TODO adding velocity below is not accurate
            physicalObject.relativePosition.add(physicalObject.velocity.clone().multiplyScalar(this.timeDeltaSec));
       }
    }
}