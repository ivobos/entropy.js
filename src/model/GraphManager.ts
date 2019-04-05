import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { CameraHolder } from "../rendering/CameraManager";
import { SimObjectVisitor } from "./SimObjectVisitor";

export class GraphManager extends AbstractComponent {

    private cameraHolder?: CameraHolder;

    constructor(options: ComponentOptions) {
        super({...options, key: GraphManager});
    }   

    setCameraHolder(cameraHolder: CameraHolder) {
        this.cameraHolder = cameraHolder;
    }

    getCameraHolder() : CameraHolder | undefined {
        return this.cameraHolder;
    }

    accept(visitor: SimObjectVisitor) {
        const node = this.getCameraHolder();
        if (node) node.accept(visitor);
    }
}