import * as THREE from "three";
import { SimStep } from "../engine/MainLoop";
import { G } from "./physics_constants";

export interface PhysicalObjectOptions {
    mass: number;
    parent?: PhysicalObject;
    relativePosition?: THREE.Vector3;   // position relative to parent
    velocity?: THREE.Vector3;
}

export abstract class PhysicalObject extends THREE.Group implements SimStep {

    private parentObject: PhysicalObject;       // points to itself if there is no parent
    private relativePosition: THREE.Vector3;    // position relative to parent

    private childObjects: PhysicalObject[];

    private mass: number;
    private velocity: THREE.Vector3;            // delta of relativePosition

    private selected: boolean;

    constructor(options: PhysicalObjectOptions) {
        super();
        this.parentObject = options.parent || this;
        this.relativePosition = options.relativePosition || new THREE.Vector3();
        this.childObjects = [];
        this.mass = options.mass;
        this.velocity = options.velocity || new THREE.Vector3(0,0,0);
        this.selected = false;
    }

    addChildObject(child: PhysicalObject): void {
        this.childObjects.push(child);
    }

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
            this.position
                .copy(this.parentObject.position)
                .add(this.relativePosition);
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
                    this.position
                        .copy(child.relativePosition)
                        .applyQuaternion(child.quaternion.clone().inverse())
                        .negate()
                        .add(child.position);
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

    move(deltav: THREE.Vector3, deltar: THREE.Vector2): void {
        this.rotateY(deltar.x);
        this.rotateX(deltar.y);
        this.velocity.add(deltav.clone().applyQuaternion(this.quaternion));
        this.velocity.multiplyScalar(0.95);
    }

    setOrbitVelocity(direction: THREE.Vector3) {
        this.velocity.copy(direction.normalize().multiplyScalar(
            Math.sqrt(G * this.parentObject.mass / this.relativePosition.length()))
        );
    }

    simStep(simulationTimestepMsec: number): void {
        if (this.parentObject == this) return;
        const timeDeltaSec = 1000 * simulationTimestepMsec;
        const force = G * this.parentObject.mass * this.mass / this.relativePosition.lengthSq();
        const deltav = this.relativePosition.clone()     
                            .normalize()
                            .multiplyScalar(- force * timeDeltaSec / this.mass);
        this.velocity.add(deltav);
        this.relativePosition.add(this.velocity.clone().multiplyScalar(timeDeltaSec));
    }

    setSelected(selected: boolean) {
        this.selected = selected;
    }

    isSelected() {
        return this.selected;
    }

    toJSON(key: any): any {
        return { 
            velocity: this.velocity,
            mass: this.mass,
            relativePosition: this.relativePosition,
        };
    }
}