import { GraphNode } from "../../graph-node";
import { GraphObjectOptions, GraphObjectInitFunction } from "../graph-object";
import { GraphObjectVisitFunction } from "../../../graph-operation";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimObject extends GraphNode {
    simulationStep: SimulationStepFunction;
}

export const simObjectInit: GraphObjectInitFunction = function(graphNode: GraphNode, options: GraphObjectOptions): void {
    const simObject = graphNode as SimObject;
    if (options.overrideSimulationStep) simObject.simulationStep = options.overrideSimulationStep;
}

export function getUpdSimStepVisitor(simulationTimestepMsec: number): GraphObjectVisitFunction {
    return function(thisNode: GraphNode, prevNode?: GraphNode): void {
        const simObject = (thisNode as any) as SimObject;
        if (simObject.simulationStep) {
            simObject.simulationStep(simulationTimestepMsec);
        }
    }
}
