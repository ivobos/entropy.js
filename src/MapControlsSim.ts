import * as THREE from 'three';
import { MainLoop, NoopSim } from "./MainLoop";
import { Container } from './Container';
import { GraphicRenderer } from './GraphicRenderer';

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