import * as THREE from "three";
import { RenderStyle, RenderStyleProps } from "../../rendering/RenderStyle";
import { SimObjectVisitor } from "../operations/SimObjectVisitor";
import { SimObjectOptions } from "./SimObjectOptions";
import { boundingRadiusInit } from "./concerns/collision";
import { physicalObjectInit } from "./concerns/physics";
import { selectableObjectInit } from "./concerns/selection";

export interface PrepareForRenderStep {
    // prepare to render visuals
    prepareForRenderStep(interpolationPercentage: number): void;
}

export interface SimulationStep {
    // update simulation
    simulationStep(simulationTimestepMsec: number): void;
}

export type SimObjectInitFunction = (simObject: SimObject, options: SimObjectOptions) => void;

// TODO: all data will be carried in properties, the only private members we should retain are those that deal with graph traversal
// TODO: should not be abstract once all data is moved to properties not directly manipulated by this class
// The SimObject has two responsibilities
// 1) interacts with SimObjectVisitor to traverse the object graph
// 2) holds object fields but doesn't interact with them in any way
export abstract class SimObject { 

    // TODO: no-parent should use undefined
    parentObject: SimObject;       // points to itself if there is no parent
    childObjects: SimObject[];

    constructor(options: SimObjectOptions) {
        this.parentObject = options.parent || this;
        this.childObjects = [];
        physicalObjectInit(this, options);
        boundingRadiusInit(this, options);        
        selectableObjectInit(this, options);
    }

    // TODO: this should be implemented as graph operation
    abstract updateRenderStyle(renderStyleProps: RenderStyleProps): void;

    addChildObject(child: SimObject): void {
        this.childObjects.push(child);
    }

    // GraphManager calls this to start graph traversal
    // NodeVisitor calls this to continue graph traversal
    accept<T extends SimObjectVisitor>(graphNodeVisitor: T, prevNode?: SimObject): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 

    toJSON(key: any): any {
        return { 
        };
    }
}