
import { PhysicalObject } from "./PhysicalObject";
import { BaseGraphNodeVisitor } from "./GraphNodeVisitor";

// TODO rename to UpdObjPosOperation
export class UpdatePositionWalk extends BaseGraphNodeVisitor {

    constructor() {
        super();
    }

    visit(node: PhysicalObject, prevNode?: PhysicalObject): void {
        super.visit(node, prevNode);
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