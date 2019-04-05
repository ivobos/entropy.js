import { SimObjectVisitor } from "../model/SimObjectVisitor";
import { SimObject } from "../model/SimObject";

export class UpdateSceneOperation extends SimObjectVisitor {

    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        super();
        this.scene = scene;
    }

    visit(currentNode: SimObject, prevNode?: SimObject | undefined): void {
        if (!this.scene.children.includes(currentNode.object3d)) {
            this.scene.add(currentNode.object3d);
        }
    }    
}