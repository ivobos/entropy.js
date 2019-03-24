import { AbstractObservableComponent, ObservableComponentOptions } from "../container/AbstractObservableComponent";
import { PhysicalObject } from "./PhysicalObject";
import { BeforeDrawStep } from "../engine/MainLoop";
import { SceneManager } from "../rendering/SceneManager";
import * as THREE from 'three';
import { CameraManager } from "../rendering/CameraManager";
import { Monitor } from "../observability/Monitor";



export class FocusManager extends AbstractObservableComponent implements BeforeDrawStep {
    private focusedObject: PhysicalObject | undefined;
    private raycaster: THREE.Raycaster;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: FocusManager});
        this.raycaster = new THREE.Raycaster();
    }

    init(): void {
        super.init();
        this.resolve(Monitor).register(this);
    }

    getAdditionalMonitorText(): string {
        if (!this.focusedObject) return "not focused";
        return this.focusedObject.constructor.name+" "+JSON.stringify(this.focusedObject);
    }

    setFocusOn(obj: PhysicalObject) {
        this.focusedObject = obj;
    }

    beforeDrawStep(interpolationPercentage: number): void {
        const scene = this.resolve(SceneManager).getScene();
        const camera = this.resolve(CameraManager).getCamera();
        if (this.focusedObject) {
            this.focusedObject.setSelected(false);
            this.focusedObject = undefined;
        }
        if (camera) {
            this.raycaster.setFromCamera( new THREE.Vector2(), camera);
            const intersects = this.raycaster.intersectObjects( scene.children, false );
            for ( var i = 0; i < intersects.length; i++ ) {
                this.focusedObject = intersects[i].object as PhysicalObject;
                this.focusedObject.setSelected(true);
                break;
            }
        }
    }


}