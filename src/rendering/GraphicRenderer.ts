import * as THREE from 'three';
import { Container } from '../container/Container';
import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent';
import { DrawStep } from '../engine/MainLoop';
import { Camera } from './Camera';
import { NoopBond } from '../model/Bond';

export interface GrapicRendererOptions extends ObservableComponentOptions {
    parentDiv: any
}

export class GraphicRenderer extends AbstractObservableComponent implements DrawStep {
    
    private camera : Camera; // THREE.Camera
    private scene : THREE.Scene;
    private renderer : THREE.Renderer;
    private rendered: boolean = false;

    constructor(options: GrapicRendererOptions) {
        super({...options, key: GraphicRenderer});
        this.camera = new Camera({}); // new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        // this.camera.position.z = 1;
        // this.camera.userData.changed = true;
        this.scene = new THREE.Scene();
        this.scene.userData.changed = true;
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        options.parentDiv.appendChild( this.renderer.domElement );
    }

    drawStep(interpolationPercentage: number): void {
        for (const object3d of this.camera.getRenderObjects()) {
            if (!this.scene.children.includes(object3d)) {
                this.scene.add(object3d);
            }
            this.renderer.render(this.scene, this.camera);
            this.rendered = true;
        }

        // if (this.scene.userData.changed || this.camera.userData.changed) {
        //     this.renderer.render( this.scene, this.camera );
        //     this.rendered = true;
        //     this.camera.userData.changed = false;
        //     this.scene.userData.changed = false;
        // } else {
        //     this.rendered = false;
        // }
    }

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        let result = "rendered="+this.rendered;
        result += " "+this.getMonitorTextFor(THREE.Camera.name, this.camera);
        result += " scene.children="+this.scene.children.length;
        return result;
    }

    addObject3D(object3d: THREE.Object3D) {
        this.scene.add( object3d );
        this.scene.userData.changed = true;
    }

    getCamera() : Camera {
        return this.camera;
    }

    getHTMLElement() : HTMLElement {
        return this.renderer.domElement;
    }
    
}

