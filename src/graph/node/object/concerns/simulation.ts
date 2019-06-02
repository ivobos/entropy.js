import { NodeWithEdges } from "../../node-edges";
import { GraphObjectProps, GraphObjectInitFunction } from "../graph-object";
import { GraphObjectVisitFunction } from "../../../graph-operation";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimObject extends NodeWithEdges {
    simulationStep: SimulationStepFunction;
}

export const simObjectInit: GraphObjectInitFunction = function(graphNode: NodeWithEdges, options: GraphObjectProps): void {
    const simObject = graphNode as SimObject;
    if (options.overrideSimulationStep) simObject.simulationStep = options.overrideSimulationStep;
}

export function getUpdSimStepVisitor(simulationTimestepMsec: number): GraphObjectVisitFunction {
    return function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        const simObject = (thisNode as any) as SimObject;
        if (simObject.simulationStep) {
            simObject.simulationStep(simulationTimestepMsec);
        }
    }
}
