import { GraphNode } from "../graph-node";
import { RenderableObj, RenderableProps } from "./concerns/presentation";
import { SimulationStepFunction, SimObject } from "./concerns/simulation";
import { CollisionObject, CollisionProps } from "./concerns/collision";
import { PhysicalObject } from "./concerns/physics";
import { SelectableObject } from "./concerns/selection";
import { CameraHolder } from "../../../rendering/CameraManager";
import { ProcGenProps, ProcGenObj } from "./concerns/procgen";

export type GraphObjectInitFunction = (simObject: GraphNode, options: GraphObjectProps) => void;

export type GraphObjProps = ProcGenProps | CollisionProps | GraphObjectProps | RenderableProps;

export function isGraphObjectProps(prop: GraphObjProps): prop is GraphObjectProps {
    return (<GraphObjectProps>prop).graphObject !== undefined;
}

export function isCollisionProps(prop: GraphObjProps): prop is CollisionProps {
    return (<CollisionProps>prop).collision !== undefined;
}

export function isProcGenProps(prop: GraphObjProps): prop is ProcGenProps {
    return (<ProcGenProps>prop).procGen !== undefined;
}

export function isRenderableProps(prop: GraphObjProps): prop is RenderableProps {
    return (<RenderableProps>prop).renderable !== undefined;
}

export function isGraphObjProps(props: any): props is GraphObjProps {
    return isGraphObjectProps(props) || isCollisionProps(props) || isProcGenProps(props) || isRenderableProps(props);
}
export interface GraphObjectProps {
    graphObject: boolean,
    name: string,
    mass: number;
    parent?: GraphNode;
    initialRelativePosition?: THREE.Vector3; // position relative to parent
    initialVelocity?: THREE.Vector3;
    radius: number;
    overrideSimulationStep?: SimulationStepFunction;
    seed?: number
}

export interface GraphObject extends GraphNode, CollisionObject, PhysicalObject, 
    RenderableObj, SelectableObject, SimObject, CameraHolder, ProcGenObj {

}