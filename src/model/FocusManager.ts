import { SimObject } from "./SimObject";
import * as THREE from 'three';
import { CameraManager } from "../rendering/CameraManager";
import { Monitor } from "../observability/Monitor";
import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { GraphicRenderer } from "../rendering/GraphicRenderer";



export class FocusManager extends AbstractComponent {
    private focusedObject: SimObject | undefined;
    private raycaster: THREE.Raycaster;

    constructor(options: ComponentOptions) {
        super({...options, key: FocusManager});
        this.raycaster = new THREE.Raycaster();
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this, additionalText: () => this.monitorText() });
    }

    monitorText(): string {
        if (!this.focusedObject) return "not focused";
        return this.focusedObject.constructor.name+" "+JSON.stringify(this.focusedObject);
    }

    setFocusOn(obj: SimObject) {
        this.focusedObject = obj;
    }

    // TODO: this should move into GraphiRenderer to simplify things
    processFocus(fps: number, panic: boolean): void {
        const scene = this.resolve(GraphicRenderer).getScene();
        const camera = this.resolve(CameraManager).getCamera();
        if (this.focusedObject) {
            this.focusedObject.setSelected(false);
            this.focusedObject = undefined;
        }
        if (camera) {
            this.raycaster.setFromCamera( new THREE.Vector2(), camera);
            const intersects = this.raycaster.intersectObjects( scene.children, false );
            for ( var i = 0; i < intersects.length; i++ ) {
                this.focusedObject = intersects[i].object.userData.graphNode as SimObject;
                this.focusedObject.setSelected(true);
                break;
            }
        }
    }


}