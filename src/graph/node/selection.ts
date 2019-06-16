import { NodeWithEdges } from "./node-edges";
import { NodeAspect, GraphNodeProps, GraphNode, NodeAspectCtor } from "./graph-node";
import { RenderableAspect } from "./presentation";

export interface SelectableObjectProps {
    selectable: true,
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

export class SelectableAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return isSelectableObjectProps(props);
    }
    
    initGraphNodeAspect(node: GraphNode, props: GraphNodeProps): void {
        selectableObjectInit(node, props as SelectableObjectProps);
    }

    dependencies(): NodeAspectCtor[] {
        return [RenderableAspect];
    }


}
