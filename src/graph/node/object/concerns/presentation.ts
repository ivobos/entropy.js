import { NodeWithEdges } from "../../node-edges";
import { RenderStyle } from "../../../../rendering/RenderStyle";
import { GraphObject } from "../graph-object";
import * as THREE from "three";
import { GraphObjectVisitFunction } from "../../../graph-operation";

export type PrepareForRenderFunction = (renderStyleProps: RenderStyle) => void;

export interface RenderableProps {
    renderable: boolean;
}

export interface RenderableObj extends NodeWithEdges, RenderableProps {
    object3d: THREE.Group;
    prepareForRender: PrepareForRenderFunction;
}

export function renderableObjectInit(simObject: NodeWithEdges, options: RenderableProps): void {
    Object.assign(simObject, options);
    const renderableObject = simObject as RenderableObj;

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
    
}

export function getPrepareForRenderVisitor(globalRenderStyle: RenderStyle): GraphObjectVisitFunction {
    return function(thisNode: NodeWithEdges, prevNode?: NodeWithEdges): void {
        const graphObject = (thisNode as GraphObject);
        if (graphObject.prepareForRender) {
            const renderStyle = globalRenderStyle.clone();
            renderStyle.highlight = renderStyle.highlight && graphObject.isSelected(); 
            graphObject.prepareForRender(renderStyle);
        }
    }
}
