import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { GraphNode } from "../graph/node/graph-node";
import { RenderableObject } from "../graph/node/object/concerns/presentation";

export class UpdateObjectsBeforeRender extends SimObjectVisitor {

    private interpolationPercentage: number;

    constructor(interpolationPercentage:  number) {
        super();
        this.interpolationPercentage = interpolationPercentage;
    }

    visit(node: GraphNode, prevNode?: GraphNode | undefined): void {
        const renderableObject = (node as RenderableObject);
        if (renderableObject.prepareForRender) {
            renderableObject.prepareForRender(this.interpolationPercentage);
        }
    }
    
}