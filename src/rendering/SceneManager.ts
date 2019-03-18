import { AbstractObservableComponent, ObservableComponentOptions } from "../container/AbstractObservableComponent";
import { BeforeDrawStep } from "../engine/MainLoop";
import * as THREE from 'three';
import { CameraManager } from "./CameraManager";


export class SceneManager extends AbstractObservableComponent implements BeforeDrawStep {
    
    private scene : THREE.Scene;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: SceneManager});
        this.scene = new THREE.Scene();
        this.scene.userData.changed = true;
    }

    getAdditionalMonitorText(): string {
        return "scene.children="+this.scene.children.length;
    }

    beforeDrawStep(interpolationPercentage: number): void {
        const cameraHolder = this.resolve(CameraManager).getCameraHolder();
        if (cameraHolder) {
            for (const object3d of cameraHolder.getReachableObjects()) {
                if (!this.scene.children.includes(object3d)) {
                    this.scene.add(object3d);
                }
            }
        }   
    }

    getScene() : THREE.Scene {
        return this.scene;
    }

}

