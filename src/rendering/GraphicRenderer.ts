import * as THREE from 'three';
import { Container } from '../container/Container';
import { BaseComponent } from '../container/BaseComponent';

export class GraphicRenderer extends BaseComponent {

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        let result = "rendered="+this.rendered;
        result += " "+this.getMonitorTextFor(THREE.Camera, this.camera);
        result += " scene.children="+this.scene.children.length;
        return result;
    }
    
    private camera : THREE.Camera
    private scene : THREE.Scene;
    private renderer : THREE.Renderer;
    private rendered: boolean = false;

    constructor(container: Container, parentDiv: any) {
        super(container, GraphicRenderer);
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;
        this.camera.userData.changed = true;
        this.scene = new THREE.Scene();
        this.scene.userData.changed = true;
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        parentDiv.appendChild( this.renderer.domElement );
    }

    addObject3D(object3d: THREE.Object3D) {
        this.scene.add( object3d );
        this.scene.userData.changed = true;
    }

    getCamera() : THREE.Camera {
        return this.camera;
    }

    getHTMLElement() : HTMLElement {
        return this.renderer.domElement;
    }
    
    render() {
        if (this.scene.userData.changed || this.camera.userData.changed) {
            this.renderer.render( this.scene, this.camera );
            this.rendered = true;
            this.camera.userData.changed = false;
            this.scene.userData.changed = false;
        } else {
            this.rendered = false;
        }
    }

}

