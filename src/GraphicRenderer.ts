import * as THREE from 'three';
import { Container } from './Container';
import { BaseComponent } from './BaseComponent';

export class GraphicRenderer extends BaseComponent {

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        let result = this.getMonitorTextFor(THREE.Camera, this.camera);
        result += "scene.children="+this.scene.children.length;
        return result;
    }
    
    private camera : THREE.Camera
    private scene : THREE.Scene;
    private renderer : THREE.Renderer;

    constructor(container: Container, parentDiv: any) {
        super(container, GraphicRenderer);
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        parentDiv.appendChild( this.renderer.domElement );
    }

    addObject3D(object3d: THREE.Object3D) {
        this.scene.add( object3d );
    }

    render() {
        this.renderer.render( this.scene, this.camera );
    }

}

