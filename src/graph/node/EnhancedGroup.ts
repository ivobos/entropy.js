import * as THREE from "three";

export class EnhancedGroup extends THREE.Group {

    raycast(raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
        const childIntersects: THREE.Intersection[] = []; 
        if (this.children.length > 0) {
            this.children[0].raycast(raycaster, childIntersects);
            for ( var i = 0; i < childIntersects.length; i++ ) {
                childIntersects[ i ].object = this;    
                intersects.push(childIntersects[i]);
            }
        }      
    }

}