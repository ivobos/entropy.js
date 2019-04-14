import * as THREE from 'three';
import { CameraHolder, CameraManager } from './CameraManager';
import { Monitor } from '../observability/Monitor';
import { AbstractComponent } from '../container/AbstractComponent';
import { ComponentOptions } from '../container/Component';
import { GraphManager } from '../graph/GraphManager';
import { UpdateRenderStyleOperation } from './UpdateRenderStyleOperation';
import { RenderStyle } from './RenderStyle';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { UpdateSceneOperation } from './UpdateSceneOperation';
import { UpdateObjectsBeforeRender } from './UpdateObjectsBeforeRender';
import { FocusManager } from '../input/FocusManager';
import { GraphNode } from '../graph/node/graph-node';
import { GraphOperation } from '../graph/graph-operation';
import { updateObjectPosition } from '../graph/node/object/concerns/physics';

export interface GrapicRendererOptions extends ComponentOptions {
    parentDiv: any
}

export class GraphicRenderer extends AbstractComponent {
    
    private renderer : THREE.Renderer;
    private renderStyle: RenderStyle = new RenderStyle({});
    private scene: THREE.Scene;
    private raycaster: THREE.Raycaster;

    constructor(options: GrapicRendererOptions) {
        super({...options, key: GraphicRenderer});
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        window.addEventListener('resize', (event: UIEvent) => this.onWindowResize(event), false);
        this.onWindowResize(undefined);    
        options.parentDiv.appendChild( this.renderer.domElement );
        this.scene = new THREE.Scene();
        this.scene.add( new THREE.AmbientLight( 0x888888 ) );
        this.resolve(Monitor).addEntry({ observable: this, additionalText: () => this.monitorText() });
        this.raycaster = new THREE.Raycaster();
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
        const graphManager = this.resolve(GraphManager);
        // prepare graph objects for rendering
        graphManager.accept(new UpdateObjectsBeforeRender(interpolationPercentage));
        graphManager.accept(new UpdateRenderStyleOperation(this.renderStyle));
        graphManager.accept(new GraphOperation(updateObjectPosition));
        graphManager.accept(new UpdateSceneOperation(this.scene));
        const camera = this.resolve(CameraManager).getCamera();
        // render
        if (camera) {
            this.renderer.render(this.scene, camera);
        }
        // raycast from center of screen to update focus
        if (camera) {
            let newFocusedObject: GraphNode | undefined = undefined;
            this.raycaster.setFromCamera( new THREE.Vector2(), camera);
            const intersects = this.raycaster.intersectObjects( this.scene.children, false );
            for ( var i = 0; i < intersects.length; i++ ) {
                newFocusedObject = intersects[i].object.userData.graphNode as GraphNode;
                break;
            }
            this.resolve(FocusManager).setFocusOn(newFocusedObject);
        }

    }

    getHTMLElement() : HTMLElement {
        return this.renderer.domElement;
    }
    
    getScene(): THREE.Scene {
        return this.scene;
    }
}

