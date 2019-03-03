import * as THREE from 'three';
import { PhysicalObject, PhysicalObjectOptions } from "../model/PhysicalObject";
import { CameraHolder } from '../rendering/CameraHolder';


interface PlayerOptions extends PhysicalObjectOptions {

}

export class Player extends PhysicalObject implements CameraHolder {

    private camera: THREE.PerspectiveCamera;

    constructor(options: PlayerOptions) {
        super({});
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000 );
        this.userData.changed = true;
    }

    getCamera() {
        return this.camera;
    }

}