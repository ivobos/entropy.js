import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';
import { ParentObjectMixin, ParentObjectOptions } from '../model/BoundObject';
import fragmentShader from './star-frag.glsl';
import vertexShader from './star-vert.glsl';
import { StarSurface } from './StarSurface';
import { StarCorona } from './StarCorona';

export interface StarOptions extends ParentObjectOptions {

}

export class Star extends ParentObjectMixin(THREE.Group) {

    constructor(options: StarOptions) {
        super();
        this.add(new StarSurface({}));
        this.add(new StarCorona({}));
    }

}