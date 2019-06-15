import { NodeWithEdges, EdgeProps, isEdgeProps } from "../node-edges";
import { RenderableObj, RenderableProps, isRenderableProps } from "./concerns/presentation";
import { SimObject } from "./concerns/simulation";
import { CollisionObject, CollisionProps, isCollisionProps } from "./concerns/collision";
import { PhysicalObject, PhysicalObjProps, isPhysicsProps } from "./concerns/physics";
import { SelectableObject, isSelectableObjectProps, SelectableObjectProps } from "./concerns/selection";
import { CameraHolder } from "../../../rendering/CameraManager";
import { ProcGenProps, ProcGenObj, isProcGenProps } from "./concerns/procgen";

export type GraphObjProps = ProcGenProps | CollisionProps | SelectableObjectProps | RenderableProps | EdgeProps | PhysicalObjProps;

export function isGraphNodeProps(props: any): props is GraphObjProps {
    return isSelectableObjectProps(props) || isCollisionProps(props) || isProcGenProps(props) || isRenderableProps(props)
        || isEdgeProps(props) || isPhysicsProps(props);
}

export interface GraphObject extends NodeWithEdges, CollisionObject, PhysicalObject, 
    RenderableObj, SelectableObject, SimObject, CameraHolder, ProcGenObj {

}