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
import { FunctionGraphOperation, AbstractGraphOperation } from '../graph/graph-operation';
import { updatePositionVisitor } from '../graph/node/object/concerns/physics';
import { getPrepareForRenderVisitor } from '../graph/node/object/concerns/presentation';
import { GraphObject } from '../graph/node/object/graph-object';

export interface GrapicRendererOptions extends ComponentOptions {
    parentDiv: any
}

const DECREASE_DETAIL_KEY = 'v';
const INCREASE_DETAIL_KEY = 'b';


/**
 * Add/remove object3d to scene.
 * 1. Walk three and if new objects are detect then insert them in scene.
 * 2. Remove from scene object3d not seen during walk.
 */
class UpdateSceneObjects extends AbstractGraphOperation {
    
    private maybeRemove: THREE.Object3D[];
    private scene: THREE.Scene

    constructor(scene: THREE.Scene) {
        super();
        this.scene = scene;
        this.maybeRemove = [...this.scene.children];
    }

    visit(currentNode: GraphNode, prevNode?: GraphNode | undefined): void {
        const graphObject = currentNode as GraphObject;
        if (this.maybeRemove.includes(graphObject.object3d)) {
            this.maybeRemove.splice(this.maybeRemove.indexOf(graphObject.object3d), 1);
        } else {
            this.scene.add(graphObject.object3d);
        }
    }    
    
    end(): void {
        this.maybeRemove.forEach(object => this.scene.remove(object)); 
    }


}

export class GraphicRenderer extends AbstractComponent {
    
    private renderer: THREE.WebGLRenderer;
    private renderStyle: RenderStyle = new RenderStyle();
    private scene: THREE.Scene;
    private raycaster: THREE.Raycaster;

    constructor(options: GrapicRendererOptions) {
        super({...options, key: GraphicRenderer});
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.sortObjects = false;
        window.addEventListener('resize', (event: UIEvent) => this.onWindowResize(event), false);
        this.onWindowResize(undefined);    
        options.parentDiv.appendChild( this.renderer.domElement );
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.add( new THREE.AmbientLight( 0x222222 ) );
        // const pl = new THREE.PointLight( 0xff00ff, 1, 10 );
        // pl.position.set(0,0,0);
        // this.scene.add(pl);
        this.raycaster = new THREE.Raycaster();
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addMonitorEntry({ name: this.constructor.name, 
            infoContent: () => this.monitorText(),
            shortcuts: "["+DECREASE_DETAIL_KEY+"]/["+INCREASE_DETAIL_KEY+"]-decrease/increase detail",
        });
        this.resolve(GlobalKeyboardHandler).registerKey(DECREASE_DETAIL_KEY, () => this.renderStyle.polygonSizeMultiplyScalar(.9));
        this.resolve(GlobalKeyboardHandler).registerKey(INCREASE_DETAIL_KEY, () => this.renderStyle.polygonSizeMultiplyScalar(1.1));
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
        graphManager.accept(new FunctionGraphOperation(updatePositionVisitor));
        graphManager.accept(new FunctionGraphOperation(getPrepareForRenderVisitor(this.renderStyle)));
        graphManager.exec(new UpdateSceneObjects(this.scene));
        this.scene.children.sort(function(a: THREE.Object3D,b: THREE.Object3D) {
            return b.position.lengthSq() - a.position.lengthSq();
        });
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

