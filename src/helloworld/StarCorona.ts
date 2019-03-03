import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';
import starCoronaVertShader from './StarCoronaVert.glsl';
import starCoronaFragShader from './StarCoronaFrag.glsl';

export interface StarCoronaOptions {

}

export class StarCorona extends THREE.Mesh {

    constructor(options: StarCoronaOptions) {
        const geometry = new THREE.IcosahedronBufferGeometry( 2, 2 );
        const material = new THREE.ShaderMaterial({vertexShader: starCoronaVertShader, fragmentShader: starCoronaFragShader, transparent: true});
        super(geometry, material);
    }

}
