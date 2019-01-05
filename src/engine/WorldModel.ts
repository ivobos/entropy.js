import { Container } from "../container/Container";
import { GraphicRenderer } from "../rendering/GraphicRenderer";
import { BaseComponent } from "../container/BaseComponent";


export class WorldModel extends BaseComponent {

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        return "";
    }

    private numObjects = 0;

    constructor(container: Container) {
        super(container, WorldModel);
    }

    addObject3D(object3d: THREE.Object3D) {
        const renderer: GraphicRenderer = this.resolve(GraphicRenderer);
        renderer.addObject3D(object3d);
        this.numObjects++;
    }

    objectCount() {
        return this.numObjects;
    }

}
