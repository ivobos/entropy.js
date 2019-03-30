import { GraphWalk } from "../model/GraphWalk";
import { PhysicalObject } from "../model/PhysicalObject";

export class UpdateSceneOperation implements GraphWalk {
    private scene: THREE.Scene;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }
    nodeVisitor(object3d: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        if (!this.scene.children.includes(object3d)) {
            this.scene.add(object3d);
        }
    }    
}