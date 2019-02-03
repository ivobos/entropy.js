import * as THREE from 'three';
import { MainLoop, SimStep } from "../engine/MainLoop";
import { HelloWorldCube } from "./HelloWorldCube";
import { randReal } from "../utils/random";
import { WorldModel } from "../engine/WorldModel";
import { ComponentMixin, ComponentOptions } from "../container/Component";

export class HelloWorldSimulation extends ComponentMixin(Object) implements SimStep {

    private manager: THREE.LoadingManager | undefined = undefined;

    constructor(options: ComponentOptions) {
        super({...options, key: HelloWorldSimulation});
    }

    // begin(timestamp: number, frameDelta: number): void {
       
    // }  

    simStep(simulationTimestep: number): void {
        if (this.resolve(WorldModel).objectCount() > 1000) return;
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

    // end(fps: number, panic: boolean): void {
        // this.resolve(Monitor).render_debug(0);
        // if (this.resolve(WorldModel).objectCount() > 1000) {
        //     this.resolve(MainLoop).stop();
        // }
    // }

}
