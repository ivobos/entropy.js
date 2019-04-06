import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { GraphObject } from "../graph/object/GraphObject";

// precondition: depends on simObject.boundingRadius being updated 
// Implements collision detection 
export class CollisionDetection extends SimObjectVisitor {


    visit(currentNode: GraphObject, prevNode?: GraphObject): void {

    }
}