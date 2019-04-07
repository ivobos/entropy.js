import { GraphNode } from "../graph-node";
import { UpdateRenderStyleFunction, PrepareForRenderFunction, RenderableObject } from "./concerns/presentation";
import { SimulationStepFunction, SimObject } from "./concerns/simulation";
import { ObjectWithBoundingRadius } from "./concerns/collision";
import { PhysicalObject } from "./concerns/physics";
import { SelectableObject } from "./concerns/selection";
import { CameraHolder } from "../../../rendering/CameraManager";

export type GraphObjectInitFunction = (simObject: GraphNode, options: GraphObjectOptions) => void;

export interface GraphObjectOptions {
    mass: number;
    parent?: GraphNode;
    relativePosition?: THREE.Vector3; // position relative to parent
    velocity?: THREE.Vector3;
    radius: number;
    updateRenderStyle?: UpdateRenderStyleFunction;
    prepareForRender?: PrepareForRenderFunction;
    simulationStep?: SimulationStepFunction;
}

export interface GraphObject extends GraphNode, ObjectWithBoundingRadius, PhysicalObject, 
    RenderableObject, SelectableObject, SimObject, CameraHolder {

}