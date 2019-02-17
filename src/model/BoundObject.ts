
import { MixinConstructor } from '../utils/MixinConstructor';
import { Bond } from './Bond';
import * as THREE from 'three';


export interface ParentObject extends THREE.Object3D {

    addChildBond(bond: Bond): void;

}

export interface ParentObjectOptions {

}

export type Object3DConstructor<T = THREE.Object3D> = new (...args: any[]) => T;

export function ParentObjectMixin<TBase extends Object3DConstructor>(Base: TBase) {
    return class extends Base implements ParentObject {

        // can't use private because https://github.com/Microsoft/TypeScript/issues/17293
        childBonds: Bond[] = [];

        constructor(...args: any[]) {
            super(...args);
            const options = <ParentObjectOptions>args[0];
        }

        addChildBond(bond: Bond): void {
            this.childBonds.push(bond);
        }

    };
}

export interface ChildObject extends THREE.Object3D {
    setParentBond(bond: Bond): void;
    getRenderObjects(): THREE.Object3D[];
}

export interface ChildObjectOptions {

}


export function ChildObjectMixin<TBase extends Object3DConstructor>(Base: TBase) {
    return class extends Base implements ChildObject {
        // can't use private because https://github.com/Microsoft/TypeScript/issues/17293
        parentBond?: Bond;

        constructor(...args: any[]) {
            super(...args);
            const options = <ChildObjectOptions>args[0];
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

    };
}

