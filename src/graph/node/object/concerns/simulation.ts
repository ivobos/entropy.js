import { GraphNode, SimObjectInitFunction } from "../../graph-node";
import { GraphObjectOptions } from "../graph-object";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimObject extends GraphNode {
    simulationStep?: SimulationStepFunction;
}

export const simObjectInit: SimObjectInitFunction = function(graphObject: GraphNode, options: GraphObjectOptions): void {
    const simObject = graphObject as SimObject;
    if (options.simulationStep) simObject.simulationStep = options.simulationStep;
}
