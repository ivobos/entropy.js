import * as THREE from 'three';
import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent';
import { DrawStep } from '../engine/MainLoop';
import { CameraHolder } from './CameraHolder';

export interface GrapicRendererOptions extends ObservableComponentOptions {
    parentDiv: any
}

export class GraphicRenderer extends AbstractObservableComponent implements DrawStep {
    
    private cameraHolder? : CameraHolder;
    private scene : THREE.Scene;
    private renderer : THREE.Renderer;
    private rendered: boolean = false;

    constructor(options: GrapicRendererOptions) {
        super({...options, key: GraphicRenderer});
        this.scene = new THREE.Scene();
        this.scene.userData.changed = true;
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        window.addEventListener('resize', (event: UIEvent) => this.onWindowResize(event), false);
        this.onWindowResize(undefined);    
        options.parentDiv.appendChild( this.renderer.domElement );
    }

    onWindowResize(event: any): void {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        if (this.cameraHolder) {
            const camera = this.cameraHolder.getCamera();
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
    }
    
    drawStep(interpolationPercentage: number): void {
        if (this.cameraHolder) {
            for (const object3d of this.cameraHolder.getReachableObjects()) {
                if (!this.scene.children.includes(object3d)) {
                    this.scene.add(object3d);
                }
                this.renderer.render(this.scene, this.cameraHolder.getCamera());
                this.rendered = true;
            }
        }
    }

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        let result = "rendered="+this.rendered;
        if (this.cameraHolder) {
            result += " "+this.getMonitorTextFor(THREE.Camera.name, this.cameraHolder.getCamera());
        }
        result += " scene.children="+this.scene.children.length;
        return result;
    }

    addObject3D(object3d: THREE.Object3D) {
        this.scene.add( object3d );
        this.scene.userData.changed = true;
    }

    setCameraHolder(cameraHolder: CameraHolder) {
        this.cameraHolder = cameraHolder;
    }

    getHTMLElement() : HTMLElement {
        return this.renderer.domElement;
    }
    
}

