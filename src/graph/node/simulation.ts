import { NodeWithEdges } from "./node-edges";
import { GraphObjectVisitFunction } from "../graph-operation";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimObject extends NodeWithEdges {
    simulationStep: SimulationStepFunction;
}

export function getUpdSimStepVisitor(simulationTimestepMsec: number): GraphObjectVisitFunction {
    return function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        const simObject = (thisNode as any) as SimObject;
        if (simObject.simulationStep) {
            simObject.simulationStep(simulationTimestepMsec);
        }
    }
}
