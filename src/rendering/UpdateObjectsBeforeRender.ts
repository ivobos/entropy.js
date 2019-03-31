import { GraphWalk } from "../model/GraphWalk";
import { PhysicalObject, PrepareForRenderStep } from "../model/PhysicalObject";

export class UpdateObjectsBeforeRender implements GraphWalk {
    private interpolationPercentage: number;

    constructor(interpolationPercentage:  number) {
        this.interpolationPercentage = interpolationPercentage;
    }

    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        const b = (node as any) as PrepareForRenderStep;
        if (b.prepareForRenderStep) {
            b.prepareForRenderStep(this.interpolationPercentage);
        }
    }
    
}