import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { SimObject } from "../graph/object/SimObject";
import { PhysicalObject } from "../graph/object/concerns/physics";

export class UpdateSceneOperation extends SimObjectVisitor {

    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        super();
        this.scene = scene;
    }

    visit(currentNode: SimObject, prevNode?: SimObject | undefined): void {
        const thisObject3d = (currentNode as PhysicalObject).object3d;
        if (!this.scene.children.includes(thisObject3d)) {
            this.scene.add(thisObject3d);
        }
    }    
}