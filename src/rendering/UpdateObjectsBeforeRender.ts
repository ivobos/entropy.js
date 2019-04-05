import { SimObjectVisitor } from "../model/SimObjectVisitor";
import { SimObject, PrepareForRenderStep } from "../model/SimObject";

export class UpdateObjectsBeforeRender extends SimObjectVisitor {

    private interpolationPercentage: number;

    constructor(interpolationPercentage:  number) {
        super();
        this.interpolationPercentage = interpolationPercentage;
    }

    visit(node: SimObject, prevNode?: SimObject | undefined): void {
        const b = (node as any) as PrepareForRenderStep;
        if (b.prepareForRenderStep) {
            b.prepareForRenderStep(this.interpolationPercentage);
        }
    }
    
}