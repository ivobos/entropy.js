import { GraphNodeVisitor } from "./GraphNodeVisitor";


export interface GraphNode {
 
    accept<T extends GraphNodeVisitor>(graphNodeVisitor: T, prevNode?: GraphNode): T;

}