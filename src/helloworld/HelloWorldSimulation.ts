import * as THREE from 'three';
import { MainLoop, SimStep, LoopStartStep } from "../engine/MainLoop";
import { ComponentMixin, ComponentOptions } from "../container/Component";
import { SphericalBody } from './SphericalBody';
import { Player } from './Player';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { globalKeyHandler } from '../engine/globals';

export class HelloWorldSimulation extends ComponentMixin(Object) implements SimStep, LoopStartStep {

    private manager: THREE.LoadingManager | undefined = undefined;

    private star?: SphericalBody;
    private player?: Player;

    constructor(options: ComponentOptions) {
        super({...options, key: HelloWorldSimulation});
    }

    loopStartStep(timestamp: number, frameDelta: number): void {
        const graphicRenderer : GraphicRenderer = this.resolve(GraphicRenderer); 
        const offset = new THREE.Vector3();
        if (globalKeyHandler.isKeyDown('a')) offset.x += .005;
        if (globalKeyHandler.isKeyDown('d')) offset.x -= .005;
        if (globalKeyHandler.isKeyDown('w')) offset.z += .005;
        if (globalKeyHandler.isKeyDown('s')) offset.z -= .005;
        if (this.player) this.player.relativeTranslate(offset);  
    }

    simStep(simulationTimestep: number): void {
        if (!this.star && !this.player) {
            this.star = new SphericalBody({ mass: 1 });
            this.player = new Player({ mass: 0.00001 });
            // const bond = new GravityBond(this.star, this.player);
            this.player.setParentObject(this.star);
            this.star.addChildObject(this.player);
            this.resolve(GraphicRenderer).setCameraHolder(this.player);
        } 
        if (this.player) {
            for (const physicalObject of this.player.getReachableObjects()) {
                physicalObject.simStep(simulationTimestep);
            }
        }
    }

}
