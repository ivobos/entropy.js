import * as THREE from "three";
import { SimStep } from "../engine/MainLoop";
import { G } from "./physics_constants";
import { RenderStyle, RenderStyleProps } from "../rendering/RenderStyle";

export interface PhysicalObjectOptions {
    mass: number;
    parent?: PhysicalObject;
    relativePosition?: THREE.Vector3;   // position relative to parent
    velocity?: THREE.Vector3;
    radius: number;
}

export abstract class PhysicalObject extends THREE.Group implements SimStep {

    private parentObject: PhysicalObject;       // points to itself if there is no parent
    private relativePosition: THREE.Vector3;    // position relative to parent

    private childObjects: PhysicalObject[];

    private mass: number;
    private radius: number;
    private velocity: THREE.Vector3;            // delta of relativePosition

    private selected: boolean;

    constructor(options: PhysicalObjectOptions) {
        super();
        this.parentObject = options.parent || this;
        this.relativePosition = options.relativePosition || new THREE.Vector3();
        this.childObjects = [];
        this.mass = options.mass;
        this.radius = options.radius;
        this.velocity = options.velocity || new THREE.Vector3(0,0,0);
        this.selected = false;
    }

    abstract updateRenderStyle(renderStyleProps: RenderStyleProps): void;

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
        if (deltav.length() !== 0 || deltar.length() !== 0) {
            this.rotateY(deltar.x);
            this.rotateX(deltar.y);
            this.velocity.add(deltav.clone().applyQuaternion(this.quaternion));
            this.velocity.multiplyScalar(0.95);
        }
    }

    /**
     * @param direction if the length < 1 then the velocity will be sub-orbit, if > 1 then it will be exit velocity
     */
    setOrbitVelocity(direction: THREE.Vector3) {
        this.velocity.copy(direction.clone().multiplyScalar(
            Math.sqrt(G * this.parentObject.mass / this.relativePosition.length()))
        );
    }

    // TODO: how to implement child to child collision
    // TODO: implement re-parenting when gravity from another object is stronger than from parent
    simStep(simulationTimestepMsec: number): void {
        if (this.parentObject == this) return;
        const timeDeltaSec = simulationTimestepMsec / 1000;
        // gravitational force
        const force = G * this.parentObject.mass * this.mass / this.relativePosition.lengthSq();
        const deltav = this.relativePosition.clone()     
                            .normalize()
                            .multiplyScalar(- force * timeDeltaSec / this.mass);
        this.velocity.add(deltav); // TODO: to conserve linear momentum have to update parentObject.velocity too        
        this.relativePosition.add(this.velocity.clone().multiplyScalar(timeDeltaSec));
        // intersection
       const overlap = this.relativePosition.length() - this.parentObject.radius - this.radius;
       if (overlap < 0) {
            const normal = this.relativePosition.clone().normalize();
            this.velocity.reflect(normal);
            // TODO: some energy would be released during reflection
            // TODO adding velocity below is not accurate
            this.relativePosition.add(this.velocity.clone().multiplyScalar(timeDeltaSec));
       }
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