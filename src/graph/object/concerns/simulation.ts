import { GraphObject, SimObjectInitFunction } from "../GraphObject";
import { SimObjectOptions } from "../SimObjectOptions";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimObject extends GraphObject {
    simulationStep?: SimulationStepFunction;
}

export const simObjectInit: SimObjectInitFunction = function(graphObject: GraphObject, options: SimObjectOptions): void {
    const simObject = graphObject as SimObject;
    if (options.simulationStep) simObject.simulationStep = options.simulationStep;
}
