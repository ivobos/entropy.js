import * as THREE from 'three';
import { DrawStep } from '../engine/MainLoop';
import { CameraHolder, CameraManager } from './CameraManager';
import { SceneManager } from './SceneManager';
import { Monitor } from '../observability/Monitor';
import { AbstractComponent } from '../container/AbstractComponent';
import { ComponentOptions } from '../container/Component';

export interface GrapicRendererOptions extends ComponentOptions {
    parentDiv: any
}

// TODO: support for different render modes, wireframe, and flat shade, etc
export class GraphicRenderer extends AbstractComponent implements DrawStep {
    
    private renderer : THREE.Renderer;
    private rendered: boolean = false;

    constructor(options: GrapicRendererOptions) {
        super({...options, key: GraphicRenderer});
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        window.addEventListener('resize', (event: UIEvent) => this.onWindowResize(event), false);
        this.onWindowResize(undefined);    
        options.parentDiv.appendChild( this.renderer.domElement );
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this });
    }

    onWindowResize(event: any): void {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        const camera = this.resolve(CameraManager).getCamera();
        if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
    }
    
    drawStep(interpolationPercentage: number): void {
        const scene = this.resolve(SceneManager).getScene();
        const camera = this.resolve(CameraManager).getCamera();
        if (camera) {
            this.renderer.render(scene, camera);
            this.rendered = true;
        }
    }

    getHTMLElement() : HTMLElement {
        return this.renderer.domElement;
    }
    
}

