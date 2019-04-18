import { GraphNode } from "../../graph-node";
import { GraphObjectOptions, GraphObjectInitFunction } from "../graph-object";


export interface SelectableObject extends GraphNode {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export const selectableObjectInit: GraphObjectInitFunction = function(graphNode: GraphNode, options: GraphObjectOptions): void {
    const selectableObject = graphNode as SelectableObject;
    selectableObject.selected = false;

    selectableObject.setSelected = function(selected: boolean) {
        this.selected = selected;
    }
    
    selectableObject.isSelected = function(): boolean {
        return this.selected;
    }
    
}
