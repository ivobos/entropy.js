import { NodeWithEdges } from "./node-edges";

export interface SelectableObjectProps {
    selectable: boolean,
}

export function isSelectableObjectProps(prop: any): prop is SelectableObjectProps {
    return (<SelectableObjectProps>prop).selectable === true;
}

export interface SelectableObject extends NodeWithEdges, SelectableObjectProps {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export function selectableObjectInit(graphNode: NodeWithEdges, options: SelectableObjectProps): void {
    const selectableObject = graphNode as SelectableObject;
    selectableObject.selected = false;

    selectableObject.setSelected = function(selected: boolean) {
        this.selected = selected;
    }
    
    selectableObject.isSelected = function(): boolean {
        return this.selected;
    }
    
}
