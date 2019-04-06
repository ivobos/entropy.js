import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { SimObject } from "../graph/object/SimObject";

// precondition: depends on simObject.boundingRadius being updated 
// Implements collision detection 
export class CollisionDetection extends SimObjectVisitor {


    visit(currentNode: SimObject, prevNode?: SimObject): void {

    }
}