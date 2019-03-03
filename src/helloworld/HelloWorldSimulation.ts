import * as THREE from 'three';
import { MainLoop, SimStep, LoopStartStep } from "../engine/MainLoop";
import { HelloWorldCube } from "./HelloWorldCube";
import { randReal } from "../utils/random";
import { WorldModel } from "../engine/WorldModel";
import { ComponentMixin, ComponentOptions } from "../container/Component";
import { SphericalBody } from './SphericalBody';
import { GravityBond } from '../model/GravityBond';
import { Player } from './Player';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
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
        if (globalKeyHandler.isKeyDown('a')) offset.x += .05;
        if (globalKeyHandler.isKeyDown('d')) offset.x -= .05;
        if (globalKeyHandler.isKeyDown('w')) offset.z += .05;
        if (globalKeyHandler.isKeyDown('s')) offset.z -= .05;
        if (this.player) this.player.relativeTranslate(offset);  
    }

    simStep(simulationTimestep: number): void {
        if (!this.star && !this.player) {
            this.star = new SphericalBody({});
            this.player = new Player({});
            const bond = new GravityBond(this.star, this.player);
            this.player.setParentBond(bond);
            this.star.addChildBond(bond);
            this.resolve(GraphicRenderer).setCameraHolder(this.player);
        } 
        if (this.star) this.star.simStep(simulationTimestep);
    }

}
