import { PhysicalObject } from "./PhysicalObject";
import { GraphNode } from "./GraphNode";

export interface GraphNodeVisitor {

    // GraphNode calls this method when visited
    visit(node: PhysicalObject, prevNode?: GraphNode): void;

    // GraphNode calls this method to continue traversal
    traverse(current: GraphNode, parent: GraphNode, children: GraphNode[], prevNode?: GraphNode): void;
}

