import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { RenderStyle } from "./RenderStyle";
import { SimObject } from "../graph/object/SimObject";

export class UpdateRenderStyleOperation extends SimObjectVisitor {
    
    private renderStyle: RenderStyle;

    constructor(renderStyle: RenderStyle) {
        super();
        this.renderStyle = renderStyle;
    }

    visit(node: SimObject, prevNode?: SimObject | undefined): void {
        node.updateRenderStyle(this.renderStyle);
    }

}