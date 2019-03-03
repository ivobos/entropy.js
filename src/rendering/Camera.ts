import { PhysicalObjectMixin, PhysicalObjectOptions } from "../model/BoundObject";
import * as THREE from 'three';


interface CameraOptions extends PhysicalObjectOptions {

}

export class Camera extends PhysicalObjectMixin(THREE.PerspectiveCamera) {

    constructor(options: CameraOptions) {
        super(70, window.innerWidth / window.innerHeight, 0.01, 1000 );
        this.userData.changed = true;
    }


}