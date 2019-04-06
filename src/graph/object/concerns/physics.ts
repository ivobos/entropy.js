import { SimObject, SimObjectInitFunction } from "../SimObject";
import { EnhancedGroup } from "../EnhancedGroup";
import { G } from "../../../physics/physics_constants";
import { SimObjectOptions } from "../SimObjectOptions";
import * as THREE from "three";


export interface PhysicalObject extends SimObject {
    object3d: THREE.Group;
    velocity: THREE.Vector3;            // delta of relativePosition
    relativePosition: THREE.Vector3;    // position relative to parent, vector from parent to this in parent's reference frame
    mass: number;
    radius: number;

    move(deltav: THREE.Vector3, deltar: THREE.Vector2): void;
    setOrbitVelocity(direction: THREE.Vector3): void;
}

export const physicalObjectInit: SimObjectInitFunction = function(simObject: SimObject, options: SimObjectOptions): void {
    const physicalObject = simObject as PhysicalObject;
    physicalObject.object3d = new EnhancedGroup();
    physicalObject.object3d.userData.graphNode = physicalObject;
    physicalObject.relativePosition = options.relativePosition || new THREE.Vector3();
    physicalObject.mass = options.mass;
    physicalObject.radius = options.radius;
    physicalObject.velocity = options.velocity || new THREE.Vector3(0,0,0);

    physicalObject.move = function(deltav: THREE.Vector3, deltar: THREE.Vector2): void {
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
    physicalObject.setOrbitVelocity = function(direction: THREE.Vector3): void {
        const parentPhysicalObject = this.parentObject as PhysicalObject;
        this.velocity.copy(direction.clone().multiplyScalar(
            Math.sqrt(G * parentPhysicalObject.mass / this.relativePosition.length()))
        );
    }

}
