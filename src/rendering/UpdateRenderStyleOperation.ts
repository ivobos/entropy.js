import { GraphWalk } from "../model/GraphWalk";
import { RenderStyle } from "./RenderStyle";
import { PhysicalObject } from "../model/PhysicalObject";

export class UpdateRenderStyleOperation implements GraphWalk {
    private renderStyle: RenderStyle;
    constructor(renderStyle: RenderStyle) {
        this.renderStyle = renderStyle;
    }
    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        node.updateRenderStyle(this.renderStyle);
    }
}