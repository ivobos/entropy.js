import { SimObject } from "./SimObject";

export interface SimObjectOptions {
    mass: number;
    parent?: SimObject;
    relativePosition?: THREE.Vector3; // position relative to parent
    velocity?: THREE.Vector3;
    radius: number;
}
