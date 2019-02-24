import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';
import { ParentObjectMixin, ParentObjectOptions } from '../model/BoundObject';
import starSurfaceFragShader from './StarSurfaceFrag.glsl';
import starSurfaceVertShader from './StarSurfaceVert.glsl';

export interface StarSurfaceOptions {

}

export class StarSurface extends THREE.Mesh {

    constructor(options: StarSurfaceOptions) {
        const geometry = new THREE.IcosahedronBufferGeometry( .1, 2 );
        const material = new THREE.ShaderMaterial({vertexShader: starSurfaceVertShader, fragmentShader: starSurfaceFragShader});
        super(geometry, material);
    }

}