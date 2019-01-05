import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';

export class HelloWorldCube extends THREE.Mesh {

    constructor() {
        const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        const material = new THREE.MeshBasicMaterial( { color: 0xfff0f0, map: texture } );
        super(geometry, material);
    }

}