import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { CameraHolder } from "../rendering/CameraManager";
import { SimObjectVisitor } from "./operations/SimObjectVisitor";
import { GraphNode } from "./node/graph-node";
import { GraphObject, GraphObjectOptions } from "./node/object/graph-object";
import { physicalObjectInit } from "./node/object/concerns/physics";
import { boundingRadiusInit } from "./node/object/concerns/collision";
import { selectableObjectInit } from "./node/object/concerns/selection";
import { renderableObjectInit } from "./node/object/concerns/presentation";
import { simObjectInit } from "./node/object/concerns/simulation";

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

    createEntity(options: GraphObjectOptions): GraphObject {
        const graphObject = new GraphNode(options);
        physicalObjectInit(graphObject, options);
        boundingRadiusInit(graphObject, options);        
        selectableObjectInit(graphObject, options);
        renderableObjectInit(graphObject, options);
        simObjectInit(graphObject, options);
        return graphObject as GraphObject;
    }

    accept(visitor: SimObjectVisitor) {
        const node = this.getCameraHolder();
        if (node) node.accept(visitor);
    }
}