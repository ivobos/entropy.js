import { GraphObject, SimObjectInitFunction } from "../GraphObject";
import { RenderStyleProps } from "../../../rendering/RenderStyle";
import { SimObjectOptions } from "../SimObjectOptions";


export type UpdateRenderStyleFunction = (renderStyleProps: RenderStyleProps) => void;
export type PrepareForRenderFunction = (interpolationPercentage: number) => void;

export interface RenderableObject extends GraphObject {
    updateRenderStyle?: UpdateRenderStyleFunction;
    prepareForRender?: PrepareForRenderFunction;
}

export const renderableObjectInit: SimObjectInitFunction = function(simObject: GraphObject, options: SimObjectOptions): void {
    const renderableObject = simObject as RenderableObject;
    if (options.updateRenderStyle) {
        renderableObject.updateRenderStyle = options.updateRenderStyle;
    }
    if (options.prepareForRender) {
        renderableObject.prepareForRender = options.prepareForRender;
    }
}