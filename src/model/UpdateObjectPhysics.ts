import { BaseGraphWalk } from "./GraphWalk";
import { PhysicalObject } from "./PhysicalObject";
import { G } from "./physics_constants";

export class UpdateObjectPhysics extends BaseGraphWalk {

    private readonly timeDeltaSec: number;

    constructor(simulationTimestepMsec: number) {
        super();
        this.timeDeltaSec = simulationTimestepMsec / 1000;
    }

    // TODO: how to implement child to child collision
    // TODO: implement re-parenting when gravity from another object is stronger than from parent
    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject): void {
        if (node.parentObject == node) return;
        // gravitational force
        const force = G * node.parentObject.mass * node.mass / node.relativePosition.lengthSq();
        const deltav = node.relativePosition.clone()     
                            .normalize()
                            .multiplyScalar(- force * this.timeDeltaSec / node.mass);
        node.velocity.add(deltav); // TODO: to conserve linear momentum have to update parentObject.velocity too        
        node.relativePosition.add(node.velocity.clone().multiplyScalar(this.timeDeltaSec));
        // intersection
       const overlap = node.relativePosition.length() - node.parentObject.radius - node.radius;
       if (overlap < 0) {
            const normal = node.relativePosition.clone().normalize();
            node.velocity.reflect(normal);
            // TODO: some energy would be released during reflection
            // TODO adding velocity below is not accurate
            node.relativePosition.add(node.velocity.clone().multiplyScalar(this.timeDeltaSec));
       }
    }
}