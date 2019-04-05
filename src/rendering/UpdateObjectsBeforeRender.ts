import { GraphNodeVisitor } from "../model/GraphNodeVisitor";
import { BaseGraphNodeVisitor } from "../model/BaseGraphNodeVisitor";
import { PhysicalObject, PrepareForRenderStep } from "../model/PhysicalObject";

export class UpdateObjectsBeforeRender extends BaseGraphNodeVisitor {

    private interpolationPercentage: number;

    constructor(interpolationPercentage:  number) {
        super();
        this.interpolationPercentage = interpolationPercentage;
    }

    visit(node: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        const b = (node as any) as PrepareForRenderStep;
        if (b.prepareForRenderStep) {
            b.prepareForRenderStep(this.interpolationPercentage);
        }
    }
    
}