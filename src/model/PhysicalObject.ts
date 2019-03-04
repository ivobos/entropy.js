import * as THREE from "three";
import { SimStep } from "../engine/MainLoop";

export interface PhysicalObjectOptions {
    mass: number;
    parent?: PhysicalObject;
    parentOffset?: THREE.Vector3;
    velocity?: THREE.Vector3;
}

export abstract class PhysicalObject extends THREE.Group implements SimStep {

    private parentObject: PhysicalObject;   // points to itself if there is no parent
    private parentOffset: THREE.Vector3;    //  = new THREE.Vector3(0,0,-6);

    private childObjects: PhysicalObject[];

    private mass: number;
    private velocity: THREE.Vector3;

    constructor(options: PhysicalObjectOptions) {
        super();
        this.parentObject = options.parent || this;
        this.parentOffset = options.parentOffset || new THREE.Vector3();
        this.childObjects = [];
        this.mass = options.mass;
        this.velocity = options.velocity || new THREE.Vector3(0,0,0);
    }

    addChildObject(child: PhysicalObject): void {
        this.childObjects.push(child);
    }

    // setParentObject(parent: PhysicalObject): void {
    //     this.parentObject = parent;
    // }

    getReachableObjects(origin?: PhysicalObject): PhysicalObject[] {
        if (!origin) {
            // start of the walk, this must be the player
            this.position.set(0,0,0);
            let objects: PhysicalObject[] = [this];
            objects = objects.concat(this.parentObject.getReachableObjects(this));
            return objects;
        } else if (this.parentObject === origin) {
            // arrived at child of parent, walking outwards
            let objects: PhysicalObject[] = [];
            this.position.copy(this.parentObject.position.clone().sub(this.parentOffset));
            objects.push(this);
            for (const child of this.childObjects) {
                objects = objects.concat(child.getReachableObjects(this));
            }
            return objects;
        } else {
            // arrived at one of players parents, walking inwards
            let objects: PhysicalObject[] = [];
            for (const child of this.childObjects) {
                if (child === origin) {
                    this.position.copy(child.position.clone().add(child.parentOffset));
                    objects.push(this);
                } else {
                    objects = objects.concat(child.getReachableObjects(this));
                }
            }
            if (this.parentObject !== this) {
                objects = objects.concat(this.parentObject.getReachableObjects(this));
            }
            return objects;
        }
    }

    relativeTranslate(offset: THREE.Vector3): void {
        this.velocity.add(offset);
    }

    simStep(simulationTimestep: number): void {
        if (this.parentObject == this) return;
        const force = .0006 * this.parentObject.mass * this.mass / this.position.distanceToSquared(this.parentObject.position);
        const deltav = this.position.sub(this.parentObject.position).normalize().multiplyScalar(force * simulationTimestep / this.mass);
        // console.log("deltav="+JSON.stringify(deltav)+" "+this.constructor.name);
        this.velocity.add(deltav);
        this.parentOffset.add(this.velocity);
    }

}