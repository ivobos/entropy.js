import { GraphNode, SimObjectInitFunction } from "../../graph-node";
import { GraphObjectOptions } from "../graph-object";


export interface SelectableObject extends GraphNode {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export const selectableObjectInit: SimObjectInitFunction = function(simObject: GraphNode, options: GraphObjectOptions): void {
    const selectableObject = simObject as SelectableObject;
    selectableObject.selected = false;

    selectableObject.setSelected = function(selected: boolean) {
        this.selected = selected;
    }
    
    selectableObject.isSelected = function(): boolean {
        return this.selected;
    }
    
}
