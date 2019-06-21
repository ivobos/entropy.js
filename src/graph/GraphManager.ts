import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { CameraHolder } from "../rendering/CameraManager";
import { FunctionGraphOperation, GraphObjectVisitFunction, GraphOperation } from "./graph-operation";
import { GraphNode, GraphNodeProps, NodeAspectCtor, NodeAspect } from "./node/graph-node";
import { SpacialObject } from "./node/space";

export interface GraphManagerOptions extends ComponentOptions {
    // seed: number;
    nodeAspects: NodeAspectCtor[];
}

export class GraphManager extends AbstractComponent {

    private cameraHolder?: CameraHolder;
    private scheduledForRemoval: GraphNode[] = [];
    private root?: GraphNode;
    private createEntityNodeAspects: NodeAspect[];
    private simulationNodeAspects: NodeAspect[];

    constructor(options: GraphManagerOptions) {
        super({...options, key: GraphManager});
        const nodeAspectByCtor: Map<NodeAspectCtor, NodeAspect> = new Map();
        options.nodeAspects.forEach(nodeAspectCtor => {
            nodeAspectByCtor.set(nodeAspectCtor, new nodeAspectCtor());
        });
        this.createEntityNodeAspects = this.generateCreateEntityNodeAspects(nodeAspectByCtor);
        console.log(this.createEntityNodeAspects);
        this.simulationNodeAspects = this.generateSimulationNodeAspects(nodeAspectByCtor);
    }   

    generateCreateEntityNodeAspects(nodeAspectByCtor: Map<NodeAspectCtor, NodeAspect>): NodeAspect[] {
        const unprocessed: NodeAspect[] = [];
        const processed: NodeAspect[] = [];
        const stack: NodeAspect[] = []; 
        // add to unprocessed 
        nodeAspectByCtor.forEach(nodeAspect => {
            if (nodeAspect.initGraphNode !== undefined) {
                unprocessed.push(nodeAspect);
            }
        });
        // sort using topological sort
        while (unprocessed.length > 0  || stack.length > 0) {
            // get a node
            const node = stack.length > 0 ? stack.pop()! : unprocessed.pop()!;
            // get dependencies that still need processing
            const unprocessedDeps = node.initDeps ? 
                node.initDeps().map(ctor => (nodeAspectByCtor.get(ctor)!)).filter(nodeAspect => !processed.includes(nodeAspect)) 
                : []; 
            if (unprocessedDeps.length === 0) {
                // all dependencies of current node have been processed, add current node to processed
                processed.push(node);
            } else {
                // have to process node
                stack.push(node);
                // and process dependencies
                unprocessedDeps.forEach(dep => {
                    // remove dependencies from unprocessed
                    unprocessed.forEach((value, index) => {
                        if (value === dep) {
                            unprocessed.splice(index, 1);
                        }
                    })
                    // if dependencies are on the stack already we have a circular dependency
                    if (stack.includes(dep)) {
                        throw Error("circular dependency processing node aspects at "+dep.constructor.name+" with stack of "
                            + stack.map(value => value.constructor.name));
                    }
                    stack.push(dep);
                })
            }
        }
        return processed;
    }

    generateSimulationNodeAspects(nodeAspectByCtor: Map<NodeAspectCtor, NodeAspect>): NodeAspect[] {
        const unprocessed: NodeAspect[] = [];
        const processed: NodeAspect[] = [];
        const stack: NodeAspect[] = []; 
        // add to unprocessed 
        nodeAspectByCtor.forEach(nodeAspect => {
            if (nodeAspect.simProcessing !== undefined) {
                unprocessed.push(nodeAspect);
            }
        });
        // sort using topological sort
        while (unprocessed.length > 0  || stack.length > 0) {
            // get a node
            const node = stack.length > 0 ? stack.pop()! : unprocessed.pop()!;
            // get dependencies that still need processing
            const unprocessedDeps = node.simExecuteAfter ? 
                node.simExecuteAfter().map(ctor => (nodeAspectByCtor.get(ctor)!)).filter(nodeAspect => !processed.includes(nodeAspect)) 
                : []; 
            if (unprocessedDeps.length === 0) {
                // all dependencies of current node have been processed, add current node to processed
                processed.push(node);
            } else {
                // have to process node
                stack.push(node);
                // and process dependencies
                unprocessedDeps.forEach(dep => {
                    // remove dependencies from unprocessed
                    unprocessed.forEach((value, index) => {
                        if (value === dep) {
                            unprocessed.splice(index, 1);
                        }
                    })
                    // if dependencies are on the stack already we have a circular dependency
                    if (stack.includes(dep)) {
                        throw Error("circular dependency in generateSimulationNodeAspects at "+dep.constructor.name+" with stack of "
                            + stack.map(value => value.constructor.name));
                    }
                    stack.push(dep);
                })
            }
        }
        return processed;
    }


    setCameraHolder(cameraHolder: CameraHolder) {
        this.cameraHolder = cameraHolder;
    }

    getCameraHolder() : CameraHolder | undefined {
        return this.cameraHolder;
    }

    setRoot(root: GraphNode) {
        this.root = root;
    }

    getRoot() : GraphNode | undefined {
        return this.root;
    }

    createEntity(...graphNodeProps: Array<GraphNodeProps>): GraphNode {
        const graphNode: GraphNode = {} as GraphNode;
        for (const nodeAspect of this.createEntityNodeAspects) {
            if (nodeAspect.isAspectProps) {
                nodeAspect.initGraphNode!(graphNode, graphNodeProps.find(nodeAspect.isAspectProps));
            } else {
                nodeAspect.initGraphNode!(graphNode, undefined);
            }
        }
        return graphNode;
    }

    removeEntity(graphObject: GraphNode): void {
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
        const cameraHolder = this.getCameraHolder() as GraphNode;
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

    filterGraphNodeProps(...anyProps: Array<any>): Array<GraphNodeProps> {
        return anyProps.filter(props => {
            for (const nodeAspect of this.createEntityNodeAspects) {
                if (nodeAspect.isAspectProps && nodeAspect.isAspectProps(props)) {
                    return true;
                }
            }
            return false;
        });
    }
    
    executeSimulationStep(simulationTimestepMsec: number): void {
        const simulationNodeAspects = this.simulationNodeAspects;
        for (const nodeAspect of simulationNodeAspects) {
            const visitFunction = function(thisNode: SpacialObject, prevNode?: SpacialObject): void {
                nodeAspect.simProcessing!(simulationTimestepMsec, thisNode as GraphNode, prevNode as GraphNode);
            }
            this.visit(visitFunction);
        }
    }

}