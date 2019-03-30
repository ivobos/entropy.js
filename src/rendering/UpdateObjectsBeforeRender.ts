import { GraphWalk } from "../model/GraphWalk";
import { PhysicalObject } from "../model/PhysicalObject";
import { BeforeDrawStep } from "../engine/MainLoop";

export class UpdateObjectsBeforeRender implements GraphWalk {
    private interpolationPercentage: number;

    constructor(interpolationPercentage:  number) {
        this.interpolationPercentage = interpolationPercentage;
    }

    nodeVisitor(node: PhysicalObject, prevNode?: PhysicalObject | undefined): void {
        const b = (node as any) as BeforeDrawStep;
        if (b.beforeDrawStep) {
            b.beforeDrawStep(this.interpolationPercentage);
        }
    }
    
}