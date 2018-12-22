import * as THREE from 'three';
import { MainLoop, NoopSim } from "./MainLoop";
import { Container } from "./Container";
import { HelloWorldCube } from "./HelloWorldCube";
import { randReal } from "./random";
import { WorldModel } from "./WorldModel";
import UV_Grid_Sm_jpg from './UV_Grid_Sm.jpg';
import dust3d_obj from './dust3d.obj';

export class HelloWorldSimulation extends NoopSim {

    private manager: THREE.LoadingManager | undefined = undefined;

    testObjectLoading() {
        this.manager = new THREE.LoadingManager( function() {
            console.log("todo: add model to scene");
        } );
        this.manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
        const textureLoader = new THREE.TextureLoader( this.manager );
        const texture = textureLoader.load( UV_Grid_Sm_jpg );
        var loader = new THREE.OBJLoader( this.manager );
				loader.load( dust3d_obj, function ( obj ) {
                    // object = obj;
                    console.log('loaded');
				}, function onProgress( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( 'model ' + percentComplete + '% downloaded' );
					}
				}, function onError() {
                    console.log('error');
                } );
    }

    constructor(container: Container) {
        super(container, HelloWorldSimulation);
        // this.testObjectLoading();
    }

    begin(timestamp: number, frameDelta: number): void {
       
    }  

    update(simulationTimestep: number): void {
        let i = 30;
        while (i > 0) {
            let object3d: HelloWorldCube; 
            object3d = new HelloWorldCube();
            const material: THREE.MeshBasicMaterial = (<THREE.MeshBasicMaterial>object3d.material);
            material.color.setRGB(randReal(0,1), randReal(0,1), randReal(0,1));
            object3d.position.set(randReal(-5, 5), randReal(-5, 5), randReal(-5, 5));
            this.resolve(WorldModel).addObject3D(object3d);
            i--;
        }
    }

    // draw(interpolationPercentage: number): void {
    //     this.resolve(GraphicRenderer).render();
    // }

    end(fps: number, panic: boolean): void {
        // this.resolve(Monitor).render_debug(0);
        if (this.resolve(WorldModel).objectCount() > 1000) {
            this.resolve(MainLoop).stop();
        }
    }

}
