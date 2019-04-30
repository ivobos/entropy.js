import * as THREE from 'three';
import { CameraManager } from './CameraManager';
import { Monitor } from '../observability/Monitor';
import { AbstractComponent } from '../container/AbstractComponent';
import { ComponentOptions } from '../container/Component';
import { GraphManager } from '../graph/GraphManager';
import { RenderStyle } from './RenderStyle';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { FocusManager } from '../input/FocusManager';
import { GraphNode } from '../graph/node/graph-node';
import { GraphOperation, GraphObjectVisitFunction } from '../graph/graph-operation';
import { updObjPosVisitor, PhysicalObject } from '../graph/node/object/concerns/physics';
import { getUpdObjBeforeRenderVisitor } from '../graph/node/object/concerns/presentation';

export interface GrapicRendererOptions extends ComponentOptions {
    parentDiv: any
}

export class GraphicRenderer extends AbstractComponent {
    
    private renderer : THREE.Renderer;
    private renderStyle: RenderStyle = new RenderStyle();
    private scene: THREE.Scene;
    private raycaster: THREE.Raycaster;

    constructor(options: GrapicRendererOptions) {
        super({...options, key: GraphicRenderer});
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        window.addEventListener('resize', (event: UIEvent) => this.onWindowResize(event), false);
        this.onWindowResize(undefined);    
        options.parentDiv.appendChild( this.renderer.domElement );
        this.scene = new THREE.Scene();
        this.scene.add( new THREE.AmbientLight( 0x666666 ) );
        const pl = new THREE.PointLight( 0xff00ff, 1, 10 );
        pl.position.set(0,0,0);
        this.scene.add(pl);
        this.raycaster = new THREE.Raycaster();
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this, additionalText: () => this.monitorText() });
        this.resolve(GlobalKeyboardHandler).registerKey('x', () => this.renderStyle.progressBoolAttributes());
        this.resolve(GlobalKeyboardHandler).registerKey('c', () => this.renderStyle.polygonSizeMultiplyScalar(.9));
        this.resolve(GlobalKeyboardHandler).registerKey('v', () => this.renderStyle.polygonSizeMultiplyScalar(1.1));
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
    
    getUpdSceneVisitor(): GraphObjectVisitFunction {
        const scene = this.scene;
        return function(thisNode: GraphNode, prevNode?: GraphNode): void {
            const thisObject3d = (thisNode as PhysicalObject).object3d;
            if (!scene.children.includes(thisObject3d)) {
                scene.add(thisObject3d);
            }
        }
    }

    doRender(interpolationPercentage: number): void {
        const graphManager = this.resolve(GraphManager);
        // prepare graph objects for rendering
        graphManager.accept(new GraphOperation(updObjPosVisitor));
        graphManager.accept(new GraphOperation(getUpdObjBeforeRenderVisitor(this.renderStyle)));
        graphManager.accept(new GraphOperation(this.getUpdSceneVisitor()));

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

