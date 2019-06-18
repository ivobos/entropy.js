import * as THREE from "three";
import { NodeAspect, GraphNodeProps, GraphNode, NodeAspectCtor } from "./graph-node";
import { PhysicsAspect } from "./physics";

export interface MovementObject {
    deltav? : THREE.Vector3
    deltar? : THREE.Vector3
}

export class MovementAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return false;
    }
    
    initGraphNodeAspect(node: GraphNode, props: GraphNodeProps): void {
        
    }

    dependencies(): NodeAspectCtor[] {
        return [PhysicsAspect];
    }
    
}