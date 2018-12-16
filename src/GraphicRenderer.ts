import * as THREE from 'three';
import { HelloWorldCube } from './HelloWorldCube';
import * as debug from './debug';
import { Fps } from './Fps';

export class GraphicRenderer {

    private camera : THREE.Camera
    private scene : THREE.Scene;
    private renderer : THREE.Renderer;
    private fps : Fps;

    constructor(parentDiv: any) {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        parentDiv.appendChild( this.renderer.domElement );
        debug.registerDebugContentProvider(this.debugContentProvider.bind(this));
        this.fps = new Fps();
    }

    debugContentProvider() {
        return "FPS: "+this.fps.getFps();       
    }

    addObject3D(object3d: THREE.Object3D) {
        this.scene.add( object3d );
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        debug.render_debug(0);    
        this.renderer.render( this.scene, this.camera );
        this.fps.frameRendered();
    }

}

