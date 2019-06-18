import { NodeWithEdges, EdgeProps } from "./node-edges";
import { RenderableObj, RenderableProps } from "./presentation";
import { SimObject } from "./simulation";
import { CollisionObject, CollisionProps } from "./collision";
import { PhysicalObject, PhysicalObjProps } from "./physics";
import { SelectableObject, SelectableObjectProps } from "./selection";
import { CameraHolder } from "../../rendering/CameraManager";
import { ProcGenProps, ProcGenObj } from "./procgen";

export type GraphNodeProps = ProcGenProps | CollisionProps | SelectableObjectProps | RenderableProps | EdgeProps | PhysicalObjProps;

export interface GraphNode extends NodeWithEdges, CollisionObject, PhysicalObject, 
    RenderableObj, SelectableObject, SimObject, CameraHolder, ProcGenObj {

}

export interface NodeAspectCtor {
    new (): NodeAspect;
}

export interface NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean;

    initGraphNodeAspect(node: GraphNode, props?: GraphNodeProps): void;    

    dependencies(): NodeAspectCtor[];

}

