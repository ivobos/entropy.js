import * as THREE from "three";
import { RenderStyle, RenderStyleProps } from "../../rendering/RenderStyle";
import { SimObjectVisitor } from "../operations/SimObjectVisitor";
import { SimObjectOptions } from "./SimObjectOptions";
import { boundingRadiusInit } from "./concerns/collision";
import { physicalObjectInit } from "./concerns/physics";
import { selectableObjectInit } from "./concerns/selection";
import { renderableObjectInit } from "./concerns/presentation";
import { simObjectInit } from "./concerns/simulation";

export type SimObjectInitFunction = (simObject: GraphObject, options: SimObjectOptions) => void;

// TODO: all data will be carried in properties, the only private members we should retain are those that deal with graph traversal
// The SimObject has two responsibilities
// 1) interacts with SimObjectVisitor to traverse the object graph
// 2) holds object fields but doesn't interact with them in any way
export class GraphObject { 

    // TODO: no-parent should use undefined
    parentObject: GraphObject;       // points to itself if there is no parent
    childObjects: GraphObject[];

    constructor(options: SimObjectOptions) {
        this.parentObject = options.parent || this;
        this.childObjects = [];
        physicalObjectInit(this, options);
        boundingRadiusInit(this, options);        
        selectableObjectInit(this, options);
        renderableObjectInit(this, options);
        simObjectInit(this, options);
    }

    addChildObject(child: GraphObject): void {
        this.childObjects.push(child);
    }

    // GraphManager calls this to start graph traversal
    // NodeVisitor calls this to continue graph traversal
    accept<T extends SimObjectVisitor>(graphNodeVisitor: T, prevNode?: GraphObject): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 

    toJSON(key: any): any {
        return { 
        };
    }
}