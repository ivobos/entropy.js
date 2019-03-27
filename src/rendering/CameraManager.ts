import * as THREE from 'three';
import { PhysicalObject } from '../model/PhysicalObject';
import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent';
import { Monitor } from '../observability/Monitor';
import { GlobalKeyboardHandler } from '../input/GlobalKeyboardHandler';

export interface CameraHolder extends PhysicalObject {

    getCamera() : THREE.PerspectiveCamera;

}

export class CameraManager extends AbstractObservableComponent {
    
    private cameraHolder?: CameraHolder;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: CameraManager});
    }

    init(): void {
        super.init();
        this.resolve(Monitor).register(this);
        this.resolve(GlobalKeyboardHandler).registerKey('u', () => this.updateFov(0.99));
        this.resolve(GlobalKeyboardHandler).registerKey('i', () => this.updateFov(1.01));
    }

    updateFov(multiplier: number): void {
        if (!this.cameraHolder) return;
        const camera = this.cameraHolder.getCamera();
        camera.fov *= multiplier;
        camera.updateProjectionMatrix();
    }

    getAdditionalMonitorText(): string {
        let result = "";
        if (this.cameraHolder) {
            result += " "+this.getMonitorTextFor(THREE.Camera.name, this.cameraHolder.getCamera());
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
