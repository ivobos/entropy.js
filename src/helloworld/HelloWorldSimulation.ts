import * as THREE from 'three';
import { MainLoop, SimStep, LoopStartStep } from "../engine/MainLoop";
import { HelloWorldCube } from "./HelloWorldCube";
import { randReal } from "../utils/random";
import { WorldModel } from "../engine/WorldModel";
import { ComponentMixin, ComponentOptions } from "../container/Component";
import { Star } from './Star';
import { GravityBond } from '../model/GravityBond';
import { Camera } from '../rendering/Camera';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { globalKeyHandler } from '../engine/globals';

export class HelloWorldSimulation extends ComponentMixin(Object) implements SimStep, LoopStartStep {

    private manager: THREE.LoadingManager | undefined = undefined;

    private star?: Star;
    
    constructor(options: ComponentOptions) {
        super({...options, key: HelloWorldSimulation});
    }

    loopStartStep(timestamp: number, frameDelta: number): void {
        const graphicRenderer : GraphicRenderer = this.resolve(GraphicRenderer); 
        const camera = graphicRenderer.getCamera();
        const offset = new THREE.Vector3();
        if (globalKeyHandler.isKeyDown('a')) offset.x += .01;
        if (globalKeyHandler.isKeyDown('d')) offset.x -= .01;
        if (globalKeyHandler.isKeyDown('w')) offset.z += .01;
        if (globalKeyHandler.isKeyDown('s')) offset.z -= .01;
        camera.relativeTranslate(offset);  
    }

    simStep(simulationTimestep: number): void {
        if (!this.star) {
            this.star = new Star({});
            const camera = this.resolve(GraphicRenderer).getCamera();
            const bond = new GravityBond(this.star, camera);
            camera.setParentBond(bond);
            this.star.addChildBond(bond);
        }
    }

}
