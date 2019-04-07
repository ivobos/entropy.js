import * as THREE from 'three';
import { GraphNode } from '../graph/node/graph-node';
import { Monitor } from '../observability/Monitor';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { AbstractComponent } from '../container/AbstractComponent';
import { ComponentOptions } from '../container/Component';
import { GraphManager } from '../graph/GraphManager';

// TODO move interface into concerns/camera-holder.ts
export interface CameraHolder extends GraphNode {

    getCamera() : THREE.PerspectiveCamera;

}

export class CameraManager extends AbstractComponent {
    
    constructor(options: ComponentOptions) {
        super({...options, key: CameraManager});
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this, additionalText: () => this.monitorText() });
        this.resolve(GlobalKeyboardHandler).registerKey('u', () => this.updateFov(0.99));
        this.resolve(GlobalKeyboardHandler).registerKey('i', () => this.updateFov(1.01));
    }

    updateFov(multiplier: number): void {
        const camera = this.getCamera();
        if (camera) {
            camera.fov *= multiplier;
            camera.updateProjectionMatrix();
        }
    }

    monitorText(): string {
        let result = "";
        const camera = this.getCamera();
        if (camera) {
            const monitor = this.resolve(Monitor);
            result += " "+monitor.getMonitorTextFor(camera);
        }
        return result;
    }

    getCamera(): THREE.PerspectiveCamera | undefined {
        const cameraHolder = this.resolve(GraphManager).getCameraHolder();
        return cameraHolder && cameraHolder.getCamera();
    }
    
}
