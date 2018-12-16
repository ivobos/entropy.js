
import { GraphicRenderer } from './GraphicRenderer';
import { WorldModel } from './WorldModel';

// all globals below, do not put globals in other files
let graphicRenderer: GraphicRenderer 
let worldModel: WorldModel

export function getGraphicRenderer() {
    if (graphicRenderer === undefined) {
        graphicRenderer = new GraphicRenderer(document.getElementById("RenderLayer"));    
    }
    return graphicRenderer;
}

export function getWorldModel() {
    if (worldModel === undefined) {
        worldModel = new WorldModel();
    }
    return worldModel;
}
