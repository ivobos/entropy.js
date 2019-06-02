import { NodeWithEdges } from "../../node-edges";
import { GraphObjectProps, GraphObjectInitFunction } from "../graph-object";


export interface SelectableObject extends NodeWithEdges {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export const selectableObjectInit: GraphObjectInitFunction = function(graphNode: NodeWithEdges, options: GraphObjectProps): void {
    const selectableObject = graphNode as SelectableObject;
    selectableObject.selected = false;

    selectableObject.setSelected = function(selected: boolean) {
        this.selected = selected;
    }
    
    selectableObject.isSelected = function(): boolean {
        return this.selected;
    }
    
}
