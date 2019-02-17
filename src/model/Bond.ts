import { ParentObject, ChildObject } from "./BoundObject";
import * as THREE from 'three';

export interface Bond {
    getRenderObjectsFromParent(): THREE.Object3D[]; 
}


export class NoopBond implements Bond {
    getRenderObjectsFromParent(): THREE.Object3D[] {
        return [];
    }


}

export class GravityBond implements Bond {

    parent: ParentObject;
    child: ChildObject;
    offset: THREE.Vector3 = new THREE.Vector3(0,0,-1);
    constructor(parent: ParentObject, child: ChildObject) {
        this.parent = parent;
        this.child = child;
    }

    getRenderObjectsFromParent(): THREE.Object3D[] {
        this.parent.position.copy(this.child.position.clone().add(this.offset));
        return [this.parent];
    }


}