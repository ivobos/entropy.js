import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';
import { ParentObjectMixin, ParentObjectOptions } from '../model/BoundObject';

export interface PlanetOptions extends ParentObjectOptions {

}

export class Planet extends ParentObjectMixin(THREE.Mesh) {

    constructor(options: PlanetOptions) {
        const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        const material = new THREE.MeshBasicMaterial( { color: 0xfff0f0, map: texture } );

        // const geometry = new THREE.SphereGeometry( 5, 32, 32 );;
        // const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );;
        super(geometry, material);
    }

}