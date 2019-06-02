import { NodeWithEdges } from "../../node-edges";

export interface ProcGenProps {
    procGen: boolean;
    seed?: number;
}

export interface ProcGenObj extends ProcGenProps {
    seed?: number;
}

export function procGenInit(obj: NodeWithEdges, props: ProcGenProps): void {
    Object.assign(obj, props);
}