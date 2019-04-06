import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { GraphObject } from "../graph/object/GraphObject";
import { PhysicalObject } from "../graph/object/concerns/physics";

export class UpdateSceneOperation extends SimObjectVisitor {

    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        super();
        this.scene = scene;
    }

    visit(currentNode: GraphObject, prevNode?: GraphObject | undefined): void {
        const thisObject3d = (currentNode as PhysicalObject).object3d;
        if (!this.scene.children.includes(thisObject3d)) {
            this.scene.add(thisObject3d);
        }
    }    
}