import { GraphNode, SimObjectInitFunction } from "../../graph-node";
import { RenderStyleProps } from "../../../../rendering/RenderStyle";
import { GraphObjectOptions } from "../graph-object";


export type UpdateRenderStyleFunction = (renderStyleProps: RenderStyleProps) => void;
export type PrepareForRenderFunction = (interpolationPercentage: number) => void;

export interface RenderableObject extends GraphNode {
    updateRenderStyle?: UpdateRenderStyleFunction;
    prepareForRender?: PrepareForRenderFunction;
}

export const renderableObjectInit: SimObjectInitFunction = function(simObject: GraphNode, options: GraphObjectOptions): void {
    const renderableObject = simObject as RenderableObject;
    if (options.updateRenderStyle) {
        renderableObject.updateRenderStyle = options.updateRenderStyle;
    }
    if (options.prepareForRender) {
        renderableObject.prepareForRender = options.prepareForRender;
    }
}