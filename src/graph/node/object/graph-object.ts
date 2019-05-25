import { GraphNode } from "../graph-node";
import { PrepareForRenderFunction, RenderableObject } from "./concerns/presentation";
import { SimulationStepFunction, SimObject } from "./concerns/simulation";
import { ObjectWithBoundingRadius } from "./concerns/collision";
import { PhysicalObject } from "./concerns/physics";
import { SelectableObject } from "./concerns/selection";
import { CameraHolder } from "../../../rendering/CameraManager";

export type GraphObjectInitFunction = (simObject: GraphNode, options: GraphObjectOptions) => void;

export interface GraphObjectOptions {
    name: string,
    mass: number;
    parent?: GraphNode;
    initialRelativePosition?: THREE.Vector3; // position relative to parent
    initialVelocity?: THREE.Vector3;
    radius: number;
    overridePrepareForRender?: PrepareForRenderFunction;
    overrideSimulationStep?: SimulationStepFunction;
}

export interface GraphObject extends GraphNode, ObjectWithBoundingRadius, PhysicalObject, 
    RenderableObject, SelectableObject, SimObject, CameraHolder {

}