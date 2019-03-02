import { ParentObject, ChildObject } from "./BoundObject";
import * as THREE from 'three';
import { Vector3 } from "three";

export interface Bond {

    getRenderObjectsFromParent(): THREE.Object3D[]; 

    relativeTranslate(offset: THREE.Vector3): void;
}

export class NoopBond implements Bond {

    relativeTranslate(offset: THREE.Vector3): void {
    }    
    
    getRenderObjectsFromParent(): THREE.Object3D[] {
        return [];
    }

}

export abstract class AbstractBond implements Bond {
    
    parent: ParentObject;
    child: ChildObject;
    offset: THREE.Vector3 = new THREE.Vector3(0,0,-6);

    constructor(parent: ParentObject, child: ChildObject) {
        this.parent = parent;
        this.child = child;
    }

    getRenderObjectsFromParent(): THREE.Object3D[] {
        this.parent.position.copy(this.child.position.clone().add(this.offset));
        return [this.parent];
    }

    relativeTranslate(offset: THREE.Vector3): void {
        this.offset.add(offset);
    }

}