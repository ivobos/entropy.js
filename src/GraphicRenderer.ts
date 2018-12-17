import * as THREE from 'three';
import { Monitorable } from './Monitor';

export class GraphicRenderer implements Monitorable {

    private camera : THREE.Camera
    private scene : THREE.Scene;
    private renderer : THREE.Renderer;

    constructor(parentDiv: any) {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        parentDiv.appendChild( this.renderer.domElement );
    }

    getMonitorText(): string {
        return "GraphicRenderer: scene.children="+this.scene.children.length;
    }

    addObject3D(object3d: THREE.Object3D) {
        this.scene.add( object3d );
    }

    render() {
        this.renderer.render( this.scene, this.camera );
    }

}

