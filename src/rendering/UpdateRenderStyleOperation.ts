import { SimObjectVisitor } from "../model/SimObjectVisitor";
import { RenderStyle } from "./RenderStyle";
import { SimObject } from "../model/SimObject";

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