import * as THREE from "three";
import { NodeAspect } from "./graph-node";

export interface MovementObject {
    deltav? : THREE.Vector3
    deltar? : THREE.Vector3
}

export class MovementAspect implements NodeAspect {
        
}