import { GraphNodeVisitor } from "../model/GraphNodeVisitor";
import { PhysicalObject } from "../model/PhysicalObject";

export class UpdateSceneOperation implements GraphNodeVisitor {
    private scene: THREE.Scene;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }
    visit(object3d: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        if (!this.scene.children.includes(object3d)) {
            this.scene.add(object3d);
        }
    }    
}