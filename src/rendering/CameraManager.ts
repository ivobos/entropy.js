import * as THREE from 'three';
import { PhysicalObject } from '../model/PhysicalObject';
import { Monitor } from '../observability/Monitor';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';
import { AbstractComponent } from '../container/AbstractComponent';
import { ComponentOptions } from '../container/Component';

export interface CameraHolder extends PhysicalObject {

    getCamera() : THREE.PerspectiveCamera;

}

export class CameraManager extends AbstractComponent {
    
    private cameraHolder?: CameraHolder;

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
        if (!this.cameraHolder) return;
        const camera = this.cameraHolder.getCamera();
        camera.fov *= multiplier;
        camera.updateProjectionMatrix();
    }

    monitorText(): string {
        let result = "";
        if (this.cameraHolder) {
            const monitor = this.resolve(Monitor);
            result += " "+monitor.getMonitorTextFor(this.cameraHolder.getCamera());
        }
        return result;
    }

    setCameraHolder(cameraHolder: CameraHolder) {
        this.cameraHolder = cameraHolder;
    }

    getCamera(): THREE.PerspectiveCamera | undefined {
        return this.cameraHolder && this.cameraHolder.getCamera();
    }
    
    getCameraHolder(): CameraHolder | undefined {
        return this.cameraHolder;
    }
}
