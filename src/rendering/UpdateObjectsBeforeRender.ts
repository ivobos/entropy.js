import { GraphNodeVisitor } from "../model/GraphNodeVisitor";
import { PhysicalObject, PrepareForRenderStep } from "../model/PhysicalObject";

export class UpdateObjectsBeforeRender implements GraphNodeVisitor {
    private interpolationPercentage: number;

    constructor(interpolationPercentage:  number) {
        this.interpolationPercentage = interpolationPercentage;
    }

    visit(node: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        const b = (node as any) as PrepareForRenderStep;
        if (b.prepareForRenderStep) {
            b.prepareForRenderStep(this.interpolationPercentage);
        }
    }
    
}