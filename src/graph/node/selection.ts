import { NodeWithEdges } from "./node-edges";
import { NodeAspect, GraphNodeProps, GraphNode, NodeAspectCtor } from "./graph-node";
import { RenderableAspect } from "./presentation";

export interface SelectableObjectProps {
    selectable: true,
}

export interface SelectableObject extends NodeWithEdges, SelectableObjectProps {
    selected: boolean;
    setSelected(selected: boolean): void;
    isSelected(): boolean;
}

export class SelectableAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<SelectableObjectProps>props).selectable === true;
    }
    
    initGraphNode(node: GraphNode, props: GraphNodeProps): void {
        const graphNode = node as NodeWithEdges;
        const selectableObject = graphNode as SelectableObject;
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
