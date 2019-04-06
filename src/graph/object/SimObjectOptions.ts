import { GraphObject } from "./GraphObject";
import { UpdateRenderStyleFunction, PrepareForRenderFunction } from "./concerns/presentation";
import { SimulationStepFunction } from "./concerns/simulation";

export interface SimObjectOptions {
    mass: number;
    parent?: GraphObject;
    relativePosition?: THREE.Vector3; // position relative to parent
    velocity?: THREE.Vector3;
    radius: number;
    updateRenderStyle?: UpdateRenderStyleFunction;
    prepareForRender?: PrepareForRenderFunction;
    simulationStep?: SimulationStepFunction;
}
