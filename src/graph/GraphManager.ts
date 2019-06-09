import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { CameraHolder } from "../rendering/CameraManager";
import { FunctionGraphOperation, GraphObjectVisitFunction, GraphOperation } from "./graph-operation";
import { graphNodeInit, NodeWithEdges, isEdgeProps } from "./node/node-edges";
import { GraphObject, GraphObjProps, isGraphObjectProps, isRenderableProps, isCollisionProps, isProcGenProps } from "./node/object/graph-object";
import { physicalObjectInit, isPhysicsProps, physicsInit } from "./node/object/concerns/physics";
import { collisionInit } from "./node/object/concerns/collision";
import { selectableObjectInit } from "./node/object/concerns/selection";
import { renderableObjectInit } from "./node/object/concerns/presentation";
import { simObjectInit } from "./node/object/concerns/simulation";
import { procGenInit } from "./node/object/concerns/procgen";

export interface GraphManagerOptions extends ComponentOptions {
    seed: number;
}

export class GraphManager extends AbstractComponent {

    private cameraHolder?: CameraHolder;
    private scheduledForRemoval: GraphObject[] = [];
    private seed: number;
    private root?: GraphObject;

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

    setRoot(root: GraphObject) {
        this.root = root;
    }

    getRoot() : GraphObject | undefined {
        return this.root;
    }

    createEntity(...propsArgs: Array<GraphObjProps>): GraphObject {
        let graphNode = {} as any as NodeWithEdges;
        for (const props of propsArgs) {
            if (isEdgeProps(props)) {
                graphNodeInit(graphNode, props);
            } else if (isGraphObjectProps(props)) {
                physicalObjectInit(graphNode, props);                    
                selectableObjectInit(graphNode, props);
                simObjectInit(graphNode, props);
            } else if (isPhysicsProps(props)) {
                physicsInit(graphNode, props);        
            } else if (isRenderableProps(props)) {
                renderableObjectInit(graphNode, props);
            } else if (isCollisionProps(props)) {
                collisionInit(graphNode, props); 
            } else if (isProcGenProps(props)) {
                procGenInit(graphNode, 
                    Object.assign({}, 
                        { seed: this.seed }, // defaults
                        props));
            }
        }    
        return graphNode as GraphObject;
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
           if (element.parent === undefined) throw new Error("can't remove root entity");
           element.parent.removeChildObject(element);
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

    rootAccept(visitor: GraphOperation): void {
        const root = this.getRoot();
        if (root) {
            root.accept(visitor);
        }
    }

    rootVisit(visitFunction: GraphObjectVisitFunction): void {
        this.rootAccept(new FunctionGraphOperation(visitFunction));
    }

    exec<T extends GraphOperation>(operation: T): T {
        this.accept(operation);
        operation.end();
        return operation;
    }

}