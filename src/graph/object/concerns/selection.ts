import { SimObject, SimObjectInitFunction } from "../SimObject";
import { SimObjectOptions } from "../SimObjectOptions";


export interface SelectableObject extends SimObject {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export const selectableObjectInit: SimObjectInitFunction = function(simObject: SimObject, options: SimObjectOptions): void {
    const selectableObject = simObject as SelectableObject;
    selectableObject.selected = false;

    selectableObject.setSelected = function(selected: boolean) {
        this.selected = selected;
    }
    
    selectableObject.isSelected = function(): boolean {
        return this.selected;
    }
    
}
