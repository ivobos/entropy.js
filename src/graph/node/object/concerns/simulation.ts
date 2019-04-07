import { GraphNode } from "../../graph-node";
import { GraphObjectOptions, GraphObjectInitFunction } from "../graph-object";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimObject extends GraphNode {
    simulationStep?: SimulationStepFunction;
}

export const simObjectInit: GraphObjectInitFunction = function(graphNode: GraphNode, options: GraphObjectOptions): void {
    const simObject = graphNode as SimObject;
    if (options.simulationStep) simObject.simulationStep = options.simulationStep;
}
