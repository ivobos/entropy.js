import { GraphOperation } from "../graph/graph-operation";
import { GraphNode } from "../graph/node/graph-node";
import { PhysicalObject } from "../graph/node/object/concerns/physics";

// TODO: move into GraphicRenderer.ts
export class UpdateSceneOperation extends GraphOperation {

    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        super();
        this.scene = scene;
    }

    visit(currentNode: GraphNode, prevNode?: GraphNode | undefined): void {
        const thisObject3d = (currentNode as PhysicalObject).object3d;
        if (!this.scene.children.includes(thisObject3d)) {
            this.scene.add(thisObject3d);
        }
    }    
}