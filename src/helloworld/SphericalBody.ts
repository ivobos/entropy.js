import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';
import fragmentShader from './star-frag.glsl';
import vertexShader from './star-vert.glsl';
import { StarSurface } from './StarSurface';
import { StarCorona } from './StarCorona';
import { PhysicalObject, PhysicalObjectOptions } from '../model/PhysicalObject';

export interface SphericalBodyOptions extends PhysicalObjectOptions {
    radius: number;
}

export class SphericalBody extends PhysicalObject {

    private surface: StarSurface;

    constructor(options: SphericalBodyOptions) {
        super(options);
        this.surface = new StarSurface({ radius: options.radius});
        this.add(this.surface);
        this.add(new StarCorona({ radius: options.radius * 2}));
    }

    simStep(simulationTimestep: number) {
        this.rotateY(0.0003);
        this.surface.simStep(simulationTimestep);
        super.simStep(simulationTimestep);
    }

}