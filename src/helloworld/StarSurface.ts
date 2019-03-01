import * as THREE from 'three';
import texture from '../textures/UV_Grid_Lrg_Texture';
import { ParentObjectMixin, ParentObjectOptions } from '../model/BoundObject';
import starSurfaceFragShader from './StarSurfaceFrag.glsl';
import starSurfaceVertShader from './StarSurfaceVert.glsl';

export interface StarSurfaceOptions {

}

export class StarSurface extends THREE.Mesh {

    constructor(options: StarSurfaceOptions) {
//        const geometry = new THREE.SphereGeometry(.1, 4,4);
        // const geometry = new THREE.CubeGeometry(.1,.1);
//       const geometry = new THREE.IcosahedronBufferGeometry( .1, 1 );
       var geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
       for (var i in geometry.vertices) {
            var vertex = geometry.vertices[i];
            vertex.normalize().multiplyScalar(.1);
        }
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 1.0 },
            },
            vertexShader: starSurfaceVertShader, 
            fragmentShader: starSurfaceFragShader});
        super(geometry, material);
    }

    simStep(simulationTimestep: number) {
        const material: THREE.ShaderMaterial = this.material as THREE.ShaderMaterial;
        material.uniforms.u_time.value += .01;        
    }
}