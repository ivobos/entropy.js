import * as THREE from 'three';
import { MainLoop, NoopSim } from "../engine/MainLoop";
import { Container } from '../container/Container';
import { GraphicRenderer } from '../rendering/GraphicRenderer';

export class MapControlsSim extends NoopSim {
    // private mapControls: THREE.MapControls | undefined = undefined;

    constructor(container: Container) {
        super(container, MapControlsSim);
    }

    begin(timestamp: number, frameDelta: number) {
        // if (this.mapControls === undefined) {
        //     const graphicRenderer : GraphicRenderer = this.resolve(GraphicRenderer); 
        //     const camera = graphicRenderer.getCamera();
        //     const domElement = graphicRenderer.getHTMLElement();
        //     this.mapControls = new THREE.MapControls( camera, domElement );
        // }
    }
}