import { ChildObjectMixin, ChildObjectOptions } from "../model/BoundObject";
import * as THREE from 'three';


interface CameraOptions extends ChildObjectOptions {

}

export class Camera extends ChildObjectMixin(THREE.PerspectiveCamera) {

    constructor(options: CameraOptions) {
        super(70, window.innerWidth / window.innerHeight, 0.01, 1000 );
        this.userData.changed = true;
    }


}