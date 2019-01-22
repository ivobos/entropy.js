import * as THREE from 'three';
import { MainLoop, LoopStartStep } from "../engine/MainLoop";
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';
import { AbstractContainable } from '../container/AbstractContainable';

export class MapControlsSim extends AbstractContainable implements LoopStartStep {
    // private mapControls: THREE.MapControls | undefined = undefined;

    // constructor(container: Container) {
    //     super(container, MapControlsSim);
    // }

    loopStartStep(timestamp: number, frameDelta: number) {
        // if (this.mapControls === undefined) {
        //     const graphicRenderer : GraphicRenderer = this.resolve(GraphicRenderer); 
        //     const camera = graphicRenderer.getCamera();
        //     const domElement = graphicRenderer.getHTMLElement();
        //     this.mapControls = new THREE.MapControls( camera, domElement );
        // }
    }
}