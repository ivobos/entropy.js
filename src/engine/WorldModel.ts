import { GraphicRenderer } from "../rendering/GraphicRenderer";
import { ComponentMixin, ComponentOptions } from "../container/Component";
import { ObservableMixin } from "../observability/Observable";


export class WorldModel extends ObservableMixin(ComponentMixin(Object)) {

    private numObjects = 0;

    constructor(options: ComponentOptions) {
        super({...options, key: WorldModel, obsDetail: () => this.getAdditionalMonitorText()});
    }

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        return "";
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
