import { GraphObject, SimObjectInitFunction } from "../GraphObject";
import { SimObjectOptions } from "../SimObjectOptions";


export interface SelectableObject extends GraphObject {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export const selectableObjectInit: SimObjectInitFunction = function(simObject: GraphObject, options: SimObjectOptions): void {
    const selectableObject = simObject as SelectableObject;
    selectableObject.selected = false;

    selectableObject.setSelected = function(selected: boolean) {
        this.selected = selected;
    }
    
    selectableObject.isSelected = function(): boolean {
        return this.selected;
    }
    
}
