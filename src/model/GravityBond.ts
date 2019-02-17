import { Object3D } from "three";
import { Bond } from "./Bond";
import { ParentObject, ChildObject } from "./BoundObject";


export class GravityBond implements Bond {
    private parent: ParentObject;
    private child: ChildObject;

    constructor(parent: ParentObject, child: ChildObject) {
        this.parent = parent;
        this.child = child;
    }

    getRenderObjectsFromParent(): Object3D[] {
        return [this.parent];
    }


}
