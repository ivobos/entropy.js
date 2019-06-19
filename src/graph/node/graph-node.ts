import { NodeWithEdges, EdgeProps } from "./node-edges";
import { RenderableObj, RenderableProps } from "./presentation";
import { SimObject } from "./simulation";
import { CollisionObject, CollisionProps } from "./collision";
import { PhysicalObject, PhysicalObjProps } from "./physics";
import { SelectableObject, SelectableObjectProps } from "./selection";
import { CameraHolder } from "../../rendering/CameraManager";
import { ProcGenProps, ProcGenObj } from "./procgen";
import { RenderStyle } from "../../rendering/RenderStyle";
import { Container } from "../../container/Container";

// graph nodes have props that are used during graph node initialisation
export type GraphNodeProps = ProcGenProps | CollisionProps | SelectableObjectProps | RenderableProps | EdgeProps | PhysicalObjProps;

// graph nodes have data associated with different aspects
export interface GraphNode extends NodeWithEdges, CollisionObject, PhysicalObject, 
    RenderableObj, SelectableObject, SimObject, CameraHolder, ProcGenObj {

}

// aspects may depend on each other, we use constructor names to implement dependencies
export interface NodeAspectCtor {
    new (): NodeAspect;
}

// callbacks for different aspects of graph-node behaviour are called during different phases of the game loop or object lifecycle
export interface NodeAspect {

    // initialisation phase, when an object is created, aspect init methods are called in order specified by
    // dependencies, its legal to pass in null props when props are not passed in
    isAspectProps?(props: GraphNodeProps): boolean;
    initGraphNode?(node: GraphNode, props?: GraphNodeProps): void;    
    initDeps?(): NodeAspectCtor[];

    // input processing phase
    inputProcessing?(node: GraphNode, timestamp: number, frameDelta: number): void;

    // simulation phase
    simProcessing?(node: GraphNode, simulationTimestepMsec: number): void;
    simExecuteAfter?(): NodeAspectCtor[];
    simExecuteBefore?(): NodeAspectCtor[];

    // rendering phase
    prepareForRender?(node: GraphNode, globalRenderStyle: RenderStyle): void;

    // procedural generation phase
    procGen?(node: GraphNode, container: Container): void;

}

