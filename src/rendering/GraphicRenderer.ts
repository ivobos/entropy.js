import * as THREE from 'three';
import { CameraHolder, CameraManager } from './CameraManager';
import { Monitor } from '../observability/Monitor';
import { AbstractComponent } from '../container/AbstractComponent';
import { ComponentOptions } from '../container/Component';
import { GraphManager } from '../model/GraphManager';
import { UpdateRenderStyleOperation } from './UpdateRenderStyleOperation';
import { RenderStyle } from './RenderStyle';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { UpdatePositionWalk } from '../model/UpdatePositionWalk';
import { UpdateSceneOperation } from './UpdateSceneOperation';
import { UpdateObjectsBeforeRender } from './UpdateObjectsBeforeRender';

export interface GrapicRendererOptions extends ComponentOptions {
    parentDiv: any
}

export class GraphicRenderer extends AbstractComponent {
    
    private renderer : THREE.Renderer;
    private renderStyle: RenderStyle = new RenderStyle({});
    private scene: THREE.Scene;

    constructor(options: GrapicRendererOptions) {
        super({...options, key: GraphicRenderer});
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        window.addEventListener('resize', (event: UIEvent) => this.onWindowResize(event), false);
        this.onWindowResize(undefined);    
        options.parentDiv.appendChild( this.renderer.domElement );
        this.scene = new THREE.Scene();
        this.resolve(Monitor).addEntry({ observable: this, additionalText: () => this.monitorText() });

    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this });
        this.resolve(GlobalKeyboardHandler).registerKey('x', () => this.renderStyle.progress());
    }

    monitorText(): string {
        return "scene.children="+this.scene.children.length+" renderStyle="+JSON.stringify(this.renderStyle);
    }

    onWindowResize(event: any): void {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        const camera = this.resolve(CameraManager).getCamera();
        if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
    }
    
    doRender(interpolationPercentage: number): void {
        this.resolve(GraphManager).execute(new UpdateObjectsBeforeRender(interpolationPercentage));
        this.resolve(GraphManager).execute(new UpdateRenderStyleOperation(this.renderStyle));
        this.resolve(GraphManager).execute(new UpdatePositionWalk());      
        this.resolve(GraphManager).execute(new UpdateSceneOperation(this.scene));
        const camera = this.resolve(CameraManager).getCamera();
        if (camera) {
            this.renderer.render(this.scene, camera);
        }
    }

    getHTMLElement() : HTMLElement {
        return this.renderer.domElement;
    }
    
    getScene(): THREE.Scene {
        return this.scene;
    }
}

