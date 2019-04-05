import { GraphNodeVisitor } from "../model/GraphNodeVisitor";
import { BaseGraphNodeVisitor } from "../model/BaseGraphNodeVisitor";
import { RenderStyle } from "./RenderStyle";
import { PhysicalObject } from "../model/PhysicalObject";

export class UpdateRenderStyleOperation extends BaseGraphNodeVisitor {
    
    private renderStyle: RenderStyle;

    constructor(renderStyle: RenderStyle) {
        super();
        this.renderStyle = renderStyle;
    }

    visit(node: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        node.updateRenderStyle(this.renderStyle);
    }

}