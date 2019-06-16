import { NodeWithEdges } from "./node-edges";
import { GraphNode, GraphNodeProps, NodeAspect, NodeAspectCtor } from "./graph-node";
import { GraphObjectVisitFunction } from "../graph-operation";
import { Container } from "../../container/Container";

export type ProcGenFunction = (container: Container, obj: GraphNode) => void;

export interface ProcGenProps {
    procGen: true;
    seed?: number;
    procGenFunction?: ProcGenFunction;
}

export function isProcGenProps(prop: GraphNodeProps): prop is ProcGenProps {
    return (<ProcGenProps>prop).procGen === true;
}

export interface ProcGenObj extends ProcGenProps {
    generated: boolean;
}

export function procGenInit(node: NodeWithEdges, props: ProcGenProps): void {
    const obj = node as any as ProcGenObj;
    Object.assign(obj, props);
    obj.generated = false;
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
        return isProcGenProps(props);
    }
    
    initGraphNodeAspect(node: GraphNode, props: GraphNodeProps): void {
        procGenInit(node, props as ProcGenProps);
    }

    dependencies(): NodeAspectCtor[] {
        return [];
    }


}
