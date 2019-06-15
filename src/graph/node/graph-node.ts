import { NodeWithEdges, EdgeProps, isEdgeProps } from "./node-edges";
import { RenderableObj, RenderableProps, isRenderableProps } from "./presentation";
import { SimObject } from "./simulation";
import { CollisionObject, CollisionProps, isCollisionProps } from "./collision";
import { PhysicalObject, PhysicalObjProps, isPhysicsProps } from "./physics";
import { SelectableObject, isSelectableObjectProps, SelectableObjectProps } from "./selection";
import { CameraHolder } from "../../rendering/CameraManager";
import { ProcGenProps, ProcGenObj, isProcGenProps } from "./procgen";

export type GraphNodeProps = ProcGenProps | CollisionProps | SelectableObjectProps | RenderableProps | EdgeProps | PhysicalObjProps;

export function isGraphNodeProps(props: any): props is GraphNodeProps {
    return isSelectableObjectProps(props) || isCollisionProps(props) || isProcGenProps(props) || isRenderableProps(props)
        || isEdgeProps(props) || isPhysicsProps(props);
}

export interface GraphNode extends NodeWithEdges, CollisionObject, PhysicalObject, 
    RenderableObj, SelectableObject, SimObject, CameraHolder, ProcGenObj {

}

export interface NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean;

    initGraphNodeAspect(node: GraphNode, props: GraphNodeProps): void;    

    dependencies(): Function[];

}

