import { SimObjectVisitor } from "../graph/operations/SimObjectVisitor";
import { GraphObject } from "../graph/object/GraphObject";
import { RenderableObject } from "../graph/object/concerns/presentation";

export class UpdateObjectsBeforeRender extends SimObjectVisitor {

    private interpolationPercentage: number;

    constructor(interpolationPercentage:  number) {
        super();
        this.interpolationPercentage = interpolationPercentage;
    }

    visit(node: GraphObject, prevNode?: GraphObject | undefined): void {
        const renderableObject = (node as RenderableObject);
        if (renderableObject.prepareForRender) {
            renderableObject.prepareForRender(this.interpolationPercentage);
        }
    }
    
}