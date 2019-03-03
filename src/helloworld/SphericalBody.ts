import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';
import { PhysicalObjectMixin, PhysicalObjectOptions } from '../model/BoundObject';
import fragmentShader from './star-frag.glsl';
import vertexShader from './star-vert.glsl';
import { StarSurface } from './StarSurface';
import { StarCorona } from './StarCorona';
import { ObservableMixin } from '../observability/Observable';

export interface SphericalBodyOptions extends PhysicalObjectOptions {

}

export class SphericalBody extends PhysicalObjectMixin(THREE.Group) {

    private surface: StarSurface;

    constructor(options: SphericalBodyOptions) {
        super();
        this.surface = new StarSurface({});
        this.add(this.surface);
        this.add(new StarCorona({}));
    }

    simStep(simulationTimestep: number) {
        this.rotateY(0.0003);
        this.surface.simStep(simulationTimestep);
    }

}