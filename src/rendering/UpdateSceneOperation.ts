import { GraphNodeVisitor } from "../model/GraphNodeVisitor";
import { BaseGraphNodeVisitor } from "../model/BaseGraphNodeVisitor";
import { PhysicalObject } from "../model/PhysicalObject";

export class UpdateSceneOperation extends BaseGraphNodeVisitor {

    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        super();
        this.scene = scene;
    }

    visit(object3d: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        if (!this.scene.children.includes(object3d)) {
            this.scene.add(object3d);
        }
    }    
}