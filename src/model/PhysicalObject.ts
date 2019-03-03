import * as THREE from "three";
import { SimStep } from "../engine/MainLoop";

export interface PhysicalObjectOptions {
    mass: number;
}

export abstract class PhysicalObject extends THREE.Group implements SimStep {

    private parentObject?: PhysicalObject;
    private parentOffset: THREE.Vector3 = new THREE.Vector3(0,0,-6);

    private childObjects: PhysicalObject[];

    private mass: number;
    private velocity: THREE.Vector3;

    constructor(options: PhysicalObjectOptions) {
        super();
        this.childObjects = [];
        this.mass = options.mass;
        this.velocity = new THREE.Vector3(0,0,0);
    }

    addChildObject(child: PhysicalObject): void {
        this.childObjects.push(child);
    }

    setParentObject(parent: PhysicalObject): void {
        this.parentObject = parent;
    }

    getReachableObjects(origin?: PhysicalObject): PhysicalObject[] {
        if (origin) {
            const child = this.childObjects[0];
            this.position.copy(child.position.clone().add(child.parentOffset));
            return [this];
        } else {
            let objects: PhysicalObject[] = [this];
            if (this.parentObject) objects = objects.concat(this.parentObject.getReachableObjects(this));
            return objects;
        }
    }

    relativeTranslate(offset: THREE.Vector3): void {
        this.velocity.add(offset);
    }

    simStep(simulationTimestep: number): void {
        this.parentOffset.add(this.velocity);
    }

}