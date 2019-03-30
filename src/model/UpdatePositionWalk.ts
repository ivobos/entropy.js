
import { PhysicalObject } from "./PhysicalObject";
import { BaseGraphWalk } from "./GraphWalk";

// TODO rename to UpdObjPosOperation
export class UpdatePositionWalk extends BaseGraphWalk {

    constructor() {
        super();
    }

    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject): void {
        super.nodeVisitor(node, prevNode);
        if (!prevNode) {
            node.position.set(0,0,0);
        } else if (node.parentObject === prevNode) {
            node.position.copy(prevNode.position)
                .add(node.relativePosition);
        } else {
            node.position
                .copy(prevNode.relativePosition)
                .negate()
                .add(prevNode.position);
        }
    }

}