import { GraphNode } from "../../graph-node";

export interface ProcGenProps {
    procGen: boolean;
    seed?: number;
}

export interface ProcGenObj extends ProcGenProps {
    seed?: number;
}

export function procGenInit(obj: GraphNode, props: ProcGenProps): void {
    Object.assign(obj, props);
}