import { SpacialObject } from "./space";
import { NodeAspect, GraphNodeProps, GraphNode, NodeAspectCtor } from "./graph-node";
import { RenderableAspect } from "./presentation";

export interface SelectableObjectProps {
    selectable: true,
    name: string
}

export interface SelectableObject extends SpacialObject, SelectableObjectProps {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export class SelectableAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<SelectableObjectProps>props).selectable === true;
    }
    
    initGraphNode(node: GraphNode, props: GraphNodeProps): void {
        const graphNode = node as SpacialObject;
        const selectableObject = graphNode as SelectableObject;
        const selectableProps = props as SelectableObjectProps
        selectableObject.name = selectableProps.name;
        selectableObject.selected = false;
        selectableObject.setSelected = function(selected: boolean) {
            this.selected = selected;
        }
        selectableObject.isSelected = function(): boolean {
            return this.selected;
        }            
    }

    initDeps(): NodeAspectCtor[] {
        return [RenderableAspect];
    }


}
