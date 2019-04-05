import * as THREE from "three";
import { G } from "../physics/physics_constants";
import { RenderStyle, RenderStyleProps } from "../rendering/RenderStyle";
import { EnhancedGroup } from "./EnhancedGroup";
import { SimObjectVisitor } from "./SimObjectVisitor";
import { SimObjectOptions } from "./SimObjectOptions";

export interface PrepareForRenderStep {
    // prepare to render visuals
    prepareForRenderStep(interpolationPercentage: number): void;
}

export interface SimulationStep {
    // update simulation
    simulationStep(simulationTimestepMsec: number): void;
}

// TODO: all data will be carried in properties, the only private members we should retain are those that deal with graph traversal
// TODO: should not be abstract once all data is moved to properties not directly manipulated by this class
// The SimObject has two responsibilities
// 1) interacts with SimObjectVisitor to traverse the object graph
// 2) holds object attributes but doesn't interact with them in any way
export abstract class SimObject { 

    object3d: THREE.Group;

    // TODO: no-parent should use undefined
    parentObject: SimObject;       // points to itself if there is no parent
    // TODO: this should be called parentOffset ?
    relativePosition: THREE.Vector3;    // position relative to parent, vector from parent to this in parent's reference frame
    private childObjects: SimObject[];

    mass: number;
    radius: number;
    velocity: THREE.Vector3;            // delta of relativePosition

    private selected: boolean;

    constructor(options: SimObjectOptions) {
        // super();
        this.object3d = new EnhancedGroup();
        this.object3d.userData.graphNode = this;
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

    addChildObject(child: SimObject): void {
        this.childObjects.push(child);
    }

    // GraphManager calls this to start graph traversal
    // NodeVisitor calls this to continue graph traversal
    accept<T extends SimObjectVisitor>(graphNodeVisitor: T, prevNode?: SimObject): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 

    move(deltav: THREE.Vector3, deltar: THREE.Vector2): void {
        if (deltav.length() !== 0 || deltar.length() !== 0) {
            this.object3d.rotateY(deltar.x);
            this.object3d.rotateX(deltar.y);
            this.velocity.add(deltav.clone().applyQuaternion(this.object3d.quaternion));
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