
import { GraphNode } from "../node/graph-node";
import { SimObjectVisitor } from "./SimObjectVisitor";
import { PhysicalObject } from "../node/object/concerns/physics";

// TODO rename to UpdObjPosOperation
// TODO move to physics.ts
export class UpdatePositionWalk extends SimObjectVisitor {

    constructor() {
        super();
    }

    visit(node: GraphNode, prevNode?: GraphNode): void {
        super.visit(node, prevNode);
        const thisObject3d = (node as PhysicalObject).object3d;
        const physicalObject = node as PhysicalObject;
        if (!prevNode) {
            thisObject3d.position.set(0,0,0);
        } else if (node.parentObject === prevNode) {
            const prevObject3d = (prevNode as PhysicalObject).object3d;
            thisObject3d.position.copy(prevObject3d.position)
                .add(physicalObject.relativePosition);
        } else {
            const prevPhysicalObject = prevNode as PhysicalObject;
            const prevObject3d = (prevNode as PhysicalObject).object3d;
            thisObject3d.position
                .copy(prevPhysicalObject.relativePosition)
                .negate()
                .add(prevObject3d.position);
        }
    }

}