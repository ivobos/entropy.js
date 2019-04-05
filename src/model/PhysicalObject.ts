import * as THREE from "three";
import { G } from "../physics/physics_constants";
import { RenderStyle, RenderStyleProps } from "../rendering/RenderStyle";
import { GraphNodeVisitor } from "./GraphNodeVisitor";
import { GraphNode } from "./GraphNode";

export interface PhysicalObjectOptions {
    mass: number;
    parent?: PhysicalObject;
    relativePosition?: THREE.Vector3;   // position relative to parent
    velocity?: THREE.Vector3;
    radius: number;
}

export interface PrepareForRenderStep {
    // prepare to render visuals
    prepareForRenderStep(interpolationPercentage: number): void;
}

export interface SimulationStep {
    // update simulation
    simulationStep(simulationTimestepMsec: number): void;
}

// TODO: rename to GraphObject
export abstract class PhysicalObject extends THREE.Group implements GraphNode { 

    // TODO: no-parent should use undefined
    parentObject: PhysicalObject;       // points to itself if there is no parent
    // TODO: this should be called parentOffset ?
    relativePosition: THREE.Vector3;    // position relative to parent, vector from parent to this in parent's reference frame
    private childObjects: PhysicalObject[];

    mass: number;
    radius: number;
    velocity: THREE.Vector3;            // delta of relativePosition

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

    // TODO: this should be implemented as graph operation
    abstract updateRenderStyle(renderStyleProps: RenderStyleProps): void;

    addChildObject(child: PhysicalObject): void {
        this.childObjects.push(child);
    }

    // GraphNode.accept
    accept<T extends GraphNodeVisitor>(graphNodeVisitor: T, prevNode?: GraphNode): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
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