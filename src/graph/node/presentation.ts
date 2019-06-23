import { SpacialObject, SpacialAspect } from "./space";
import { RenderStyle } from "../../rendering/RenderStyle";
import { GraphNode, GraphNodeProps, NodeAspect, NodeAspectCtor } from "./graph-node";
import * as THREE from "three";
import { GraphObjectVisitFunction } from "../graph-operation";

export type PrepareForRenderFunction = (renderStyleProps: RenderStyle) => void;

export interface RenderableProps {
    renderable: true;
}

export interface RenderableObj extends SpacialObject, RenderableProps {
    prepareForRender: PrepareForRenderFunction;
}

export function getPrepareForRenderVisitor(globalRenderStyle: RenderStyle): GraphObjectVisitFunction {
    return function(thisNode: SpacialObject, prevNode?: SpacialObject): void {
        const graphObject = (thisNode as GraphNode);
        if (graphObject.prepareForRender) {
            const renderStyle = globalRenderStyle.clone();
            renderStyle.highlight = renderStyle.highlight && graphObject.isSelected(); 
            graphObject.prepareForRender(renderStyle);
        }
    }
}

export class RenderableAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<RenderableProps>props).renderable === true;
    }    
        
    initGraphNode(node: GraphNode, props: GraphNodeProps): void {
        const simObject = node as SpacialObject;
        const options = props as RenderableProps;
        Object.assign(simObject, options);
        const renderableObject = simObject as RenderableObj;
        
        // intersection with object3d.children are reported as intersection with the group object
        renderableObject.object3d.raycast = function(raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
            const childIntersects: THREE.Intersection[] = []; 
            if (this.children.length > 0) {
                this.children[0].raycast(raycaster, childIntersects);
                for ( var i = 0; i < childIntersects.length; i++ ) {
                    childIntersects[ i ].object = this;    
                    intersects.push(childIntersects[i]);
                }
            }      
        }    
        // keep a link from object3d to graph object for use during intersection checks
        renderableObject.object3d.userData.graphNode = renderableObject;
    }

    initDeps(): NodeAspectCtor[] {
        return[SpacialAspect];
    }

}
