import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { SimObject, PrepareForRenderStep } from "../graph/object/SimObject";

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