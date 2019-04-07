import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { RenderStyle } from "./RenderStyle";
import { GraphNode } from "../graph/node/graph-node";
import { RenderableObject } from "../graph/node/object/concerns/presentation";

export class UpdateRenderStyleOperation extends SimObjectVisitor {
    
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