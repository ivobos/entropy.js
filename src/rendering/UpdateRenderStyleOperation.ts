import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { RenderStyle } from "./RenderStyle";
import { GraphObject } from "../graph/object/GraphObject";
import { RenderableObject } from "../graph/object/concerns/presentation";

export class UpdateRenderStyleOperation extends SimObjectVisitor {
    
    private renderStyle: RenderStyle;

    constructor(renderStyle: RenderStyle) {
        super();
        this.renderStyle = renderStyle;
    }

    visit(node: GraphObject, prevNode?: GraphObject | undefined): void {
        const renderableObject = node as RenderableObject;
        if (renderableObject.updateRenderStyle) renderableObject.updateRenderStyle(this.renderStyle);
    }

}