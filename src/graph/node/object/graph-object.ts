import { NodeWithEdges, EdgeProps, isEdgeProps } from "../node-edges";
import { RenderableObj, RenderableProps } from "./concerns/presentation";
import { SimulationStepFunction, SimObject } from "./concerns/simulation";
import { CollisionObject, CollisionProps } from "./concerns/collision";
import { PhysicalObject, PhysicalObjProps, isPhysicsProps } from "./concerns/physics";
import { SelectableObject } from "./concerns/selection";
import { CameraHolder } from "../../../rendering/CameraManager";
import { ProcGenProps, ProcGenObj } from "./concerns/procgen";

export type GraphObjectInitFunction = (simObject: NodeWithEdges, options: GraphObjectProps) => void;

export type GraphObjProps = ProcGenProps | CollisionProps | GraphObjectProps | RenderableProps | EdgeProps | PhysicalObjProps;

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
    return isGraphObjectProps(props) || isCollisionProps(props) || isProcGenProps(props) || isRenderableProps(props)
        || isEdgeProps(props) || isPhysicsProps(props);
}
export interface GraphObjectProps {
    graphObject: boolean,
    name: string,
    mass: number;
    parent?: NodeWithEdges;
    initialRelativePosition?: THREE.Vector3; // position relative to parent
    radius: number;
    overrideSimulationStep?: SimulationStepFunction;
    seed?: number
}

export interface GraphObject extends NodeWithEdges, CollisionObject, PhysicalObject, 
    RenderableObj, SelectableObject, SimObject, CameraHolder, ProcGenObj {

}