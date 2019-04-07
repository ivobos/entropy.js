import { GraphOperation } from "../graph/graph-operation";
import { GraphNode } from "../graph/node/graph-node";
import { RenderableObject } from "../graph/node/object/concerns/presentation";

// TODO: move into concerns/presentation.ts
export class UpdateObjectsBeforeRender extends GraphOperation {

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