import { GraphNode } from "../../graph-node";
import { RenderStyle } from "../../../../rendering/RenderStyle";
import { GraphObjectOptions, GraphObjectInitFunction, GraphObject } from "../graph-object";
import * as THREE from "three";
import { GraphObjectVisitFunction } from "../../../graph-operation";

export type PrepareForRenderFunction = (renderStyleProps: RenderStyle) => void;

// TODO rename as it clashes with THREE.RenderableObject
export interface RenderableObject extends GraphNode {
    object3d: THREE.Group;
    prepareForRender?: PrepareForRenderFunction;
}

export const renderableObjectInit: GraphObjectInitFunction = function(simObject: GraphNode, options: GraphObjectOptions): void {
    const renderableObject = simObject as RenderableObject;

    // object is a THREE.GROUP
    renderableObject.object3d = new THREE.Group();

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
    
    // some objects have a custom prepareForRender function
    if (options.prepareForRender) {
        renderableObject.prepareForRender = options.prepareForRender;
    }
}

export function getUpdObjBeforeRenderVisitor(globalRenderStyle: RenderStyle): GraphObjectVisitFunction {
    return function(thisNode: GraphNode, prevNode?: GraphNode): void {
        const graphObject = (thisNode as GraphObject);
        if (graphObject.prepareForRender) {
            const renderStyle = globalRenderStyle.clone();
            renderStyle.highlight = renderStyle.highlight && graphObject.isSelected(); 
            graphObject.prepareForRender(renderStyle);
        }
    }
}
