import { GraphNode } from "../graph-node";
import { PrepareForRenderFunction, RenderableObject } from "./concerns/presentation";
import { SimulationStepFunction, SimObject } from "./concerns/simulation";
import { CollisionObject, CollisionProps } from "./concerns/collision";
import { PhysicalObject } from "./concerns/physics";
import { SelectableObject } from "./concerns/selection";
import { CameraHolder } from "../../../rendering/CameraManager";
import { ProcGenProps, ProcGenObj } from "./concerns/procgen";

export type GraphObjectInitFunction = (simObject: GraphNode, options: GraphObjectProps) => void;

export type GraphObjProps = ProcGenProps | CollisionProps | GraphObjectProps;

export interface GraphObjectProps {
    graphObject: boolean,
    name: string,
    mass: number;
    parent?: GraphNode;
    initialRelativePosition?: THREE.Vector3; // position relative to parent
    initialVelocity?: THREE.Vector3;
    radius: number;
    overridePrepareForRender?: PrepareForRenderFunction;
    overrideSimulationStep?: SimulationStepFunction;
    seed?: number
}

export interface GraphObject extends GraphNode, CollisionObject, PhysicalObject, 
    RenderableObject, SelectableObject, SimObject, CameraHolder, ProcGenObj {

}