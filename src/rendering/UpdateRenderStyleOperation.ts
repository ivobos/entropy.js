import { GraphOperation } from "../graph/graph-operation";
import { RenderStyle } from "./RenderStyle";
import { GraphNode } from "../graph/node/graph-node";
import { RenderableObject } from "../graph/node/object/concerns/presentation";

// TODO: move into concerns/presentation.ts
// TODO: or this should only be called when render style actually changes
export class UpdateRenderStyleOperation extends GraphOperation {
    
    private renderStyle: RenderStyle;

    constructor(renderStyle: RenderStyle) {
        super();
        this.renderStyle = renderStyle;
    }

    visit(node: GraphNode, prevNode?: GraphNode | undefined): void {
        const renderableObject = node as RenderableObject;
        if (renderableObject.updateRenderStyle) renderableObject.updateRenderStyle(this.renderStyle);
    }

}