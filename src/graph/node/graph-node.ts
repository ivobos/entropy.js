import * as THREE from "three";
import { SimObjectVisitor } from "../operations/SimObjectVisitor";
import { boundingRadiusInit } from "./object/concerns/collision";
import { physicalObjectInit } from "./object/concerns/physics";
import { selectableObjectInit } from "./object/concerns/selection";
import { renderableObjectInit } from "./object/concerns/presentation";
import { simObjectInit } from "./object/concerns/simulation";
import { GraphObjectOptions } from "./object/graph-object";

export class GraphNode { 

    // TODO: no-parent should use undefined
    parentObject: GraphNode;       // points to itself if there is no parent
    childObjects: GraphNode[];

    constructor(options: GraphObjectOptions) {
        this.parentObject = options.parent || this;
        this.childObjects = [];
    }

    addChildObject(child: GraphNode): void {
        this.childObjects.push(child);
    }

    // GraphManager calls this to start graph traversal
    // NodeVisitor calls this to continue graph traversal
    accept<T extends SimObjectVisitor>(graphNodeVisitor: T, prevNode?: GraphNode): T {
        graphNodeVisitor.visit(this, prevNode);
        graphNodeVisitor.traverse(this, this.parentObject, this.childObjects, prevNode);
        return graphNodeVisitor;
    } 

    toJSON(key: any): any {
        return { 
        };
    }
}