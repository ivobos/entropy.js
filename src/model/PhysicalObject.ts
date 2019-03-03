import * as THREE from "three";
import { Bond } from "./Bond";

export interface PhysicalObjectOptions {

}

export abstract class PhysicalObject extends THREE.Group {

    private childBonds: Bond[] = [];
    private parentBond?: Bond;

    constructor(options: PhysicalObjectOptions) {
        super();
    }

    addChildBond(bond: Bond): void {
        this.childBonds.push(bond);
    }

    setParentBond(bond: Bond): void {
        this.parentBond = bond;
    }

    getRenderObjects(): THREE.Object3D[] {
        if (this.parentBond) {
            return this.parentBond.getRenderObjectsFromParent();
        } else {
            return [];
        }
    }

    relativeTranslate(offset: THREE.Vector3): void {
        if (this.parentBond) {
            this.parentBond.relativeTranslate(offset);
        }
    }
    
}