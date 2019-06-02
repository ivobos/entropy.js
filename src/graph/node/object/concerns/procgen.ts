import { NodeWithEdges } from "../../node-edges";
import { GraphObject } from "../graph-object";
import { GraphObjectVisitFunction } from "../../../graph-operation";
import { Container } from "../../../../container/Container";

export type ProcGenFunction = (container: Container, obj: GraphObject) => void;

export interface ProcGenProps {
    procGen: boolean;
    seed?: number;
    procGenFunction?: ProcGenFunction;
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
            obj.procGenFunction(container, obj as GraphObject);
            obj.generated = true;
        }
    };
}
