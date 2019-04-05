import { GraphNodeVisitor } from "../model/GraphNodeVisitor";
import { RenderStyle } from "./RenderStyle";
import { PhysicalObject } from "../model/PhysicalObject";

export class UpdateRenderStyleOperation implements GraphNodeVisitor {
    private renderStyle: RenderStyle;
    constructor(renderStyle: RenderStyle) {
        this.renderStyle = renderStyle;
    }
    visit(node: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        node.updateRenderStyle(this.renderStyle);
    }
}