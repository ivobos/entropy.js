import * as THREE from 'three';
import { PhysicalObject } from '../model/PhysicalObject';
import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent';
import { Monitor } from '../observability/Monitor';

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
