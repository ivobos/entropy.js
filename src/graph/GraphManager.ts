import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { CameraHolder } from "../rendering/CameraManager";
import { FunctionGraphOperation, GraphObjectVisitFunction, GraphOperation } from "./graph-operation";
import { graphNodeInit } from "./node/graph-node";
import { GraphObject, GraphObjectOptions } from "./node/object/graph-object";
import { physicalObjectInit } from "./node/object/concerns/physics";
import { boundingRadiusInit } from "./node/object/concerns/collision";
import { selectableObjectInit } from "./node/object/concerns/selection";
import { renderableObjectInit } from "./node/object/concerns/presentation";
import { simObjectInit } from "./node/object/concerns/simulation";
import { generatableObjectInit } from "./node/object/concerns/generation";

export interface GraphManagerOptions extends ComponentOptions {
    seed: number;
}
export class GraphManager extends AbstractComponent {

    private cameraHolder?: CameraHolder;
    private scheduledForRemoval: GraphObject[] = [];
    private seed: number;

    constructor(options: GraphManagerOptions) {
        super({...options, key: GraphManager});
        this.seed = options.seed;
    }   

    setCameraHolder(cameraHolder: CameraHolder) {
        this.cameraHolder = cameraHolder;
    }

    getCameraHolder() : CameraHolder | undefined {
        return this.cameraHolder;
    }

    createEntity(options: GraphObjectOptions): GraphObject {
        options.seed = this.seed;
        const graphObject = graphNodeInit(options);
        physicalObjectInit(graphObject, options);
        boundingRadiusInit(graphObject, options);        
        selectableObjectInit(graphObject, options);
        renderableObjectInit(graphObject, options);
        simObjectInit(graphObject, options);
        generatableObjectInit(graphObject as any as GraphObjectOptions);
        return graphObject as GraphObject;
    }

    removeEntity(graphObject: GraphObject): void {
        this.scheduledForRemoval.push(graphObject);
    }

    /**
     * Iterate through this.scheduledForRemoval and remove the entity from the graph.
     * Objects that nave no parent (root entity) or have no children can not be removed.
     */
    removeScheduledEntities(): void {
        this.scheduledForRemoval.forEach(element => {
           if (element.childObjects.length > 0) throw new Error("has child objects"); 
           if (element.parentObject === undefined) throw new Error("can't remove root entity");
           element.parentObject.removeChildObject(element);
        });
        this.scheduledForRemoval = [];
    }

    accept(visitor: GraphOperation): void {
        const cameraHolder = this.getCameraHolder() as GraphObject;
        if (cameraHolder) {
            cameraHolder.accept(visitor);
        }
    }

    visit(visitFunction: GraphObjectVisitFunction): void {
        this.accept(new FunctionGraphOperation(visitFunction));
    }

    exec<T extends GraphOperation>(operation: T): T {
        this.accept(operation);
        operation.end();
        return operation;
    }

}