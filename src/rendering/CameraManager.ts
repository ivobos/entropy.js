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

const DEC_FOV_KEY = 'n';
const INC_FOV_KEY = 'm';

export class CameraManager extends AbstractComponent {
    
    constructor(options: ComponentOptions) {
        super({...options, key: CameraManager});
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addMonitorEntry({ 
            name: this.constructor.name, 
            infoContent:  () => this.monitorContent(),
            shortcuts: "["+DEC_FOV_KEY+"]/["+INC_FOV_KEY+"]-increase/decrease field of view",
        });
        this.resolve(GlobalKeyboardHandler).registerKey(DEC_FOV_KEY, () => this.updateFov(0.99));
        this.resolve(GlobalKeyboardHandler).registerKey(INC_FOV_KEY, () => this.updateFov(1.01));
    }

    updateFov(multiplier: number): void {
        const camera = this.getCamera();
        if (camera) {
            camera.fov *= multiplier;
            camera.updateProjectionMatrix();
        }
    }

    monitorContent(): string {
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
