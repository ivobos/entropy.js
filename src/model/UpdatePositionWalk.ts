
import { SimObject } from "./SimObject";
import { SimObjectVisitor } from "./SimObjectVisitor";

// TODO rename to UpdObjPosOperation
export class UpdatePositionWalk extends SimObjectVisitor {

    constructor() {
        super();
    }

    visit(node: SimObject, prevNode?: SimObject): void {
        super.visit(node, prevNode);
        if (!prevNode) {
            node.object3d.position.set(0,0,0);
        } else if (node.parentObject === prevNode) {
            node.object3d.position.copy(prevNode.object3d.position)
                .add(node.relativePosition);
        } else {
            node.object3d.position
                .copy(prevNode.relativePosition)
                .negate()
                .add(prevNode.object3d.position);
        }
    }

}