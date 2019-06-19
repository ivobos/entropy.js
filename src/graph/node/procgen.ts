import { NodeWithEdges } from "./node-edges";
import { GraphNode, GraphNodeProps, NodeAspect } from "./graph-node";
import { GraphObjectVisitFunction } from "../graph-operation";
import { Container } from "../../container/Container";

export type ProcGenFunction = (container: Container, obj: GraphNode) => void;

export interface ProcGenProps {
    procGen: true;
    seed?: number;
    procGenFunction?: ProcGenFunction;
}

export interface ProcGenObj extends ProcGenProps {
    generated: boolean;
}

export function createProcGenVisitor(container: Container): GraphObjectVisitFunction {
    return function(currentNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        const obj = currentNode as any as ProcGenObj;
        if (!obj.generated && obj.procGenFunction !== undefined) {
            obj.procGenFunction(container, obj as GraphNode);
            obj.generated = true;
        }
    };
}

export class ProcGenAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<ProcGenProps>props).procGen === true;
    }
    
    initGraphNode(graphNode: GraphNode, props: GraphNodeProps): void {
        const node = graphNode as NodeWithEdges;
        const obj = node as any as ProcGenObj;
        Object.assign(obj, props);
        obj.generated = false;
    }

}
