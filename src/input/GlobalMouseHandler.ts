import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent'
import * as THREE from "three";
import { Monitor } from '../observability/Monitor';

export class GlobalMouseHandler extends AbstractObservableComponent {
    private mouseMoveVector = new THREE.Vector2();

    init(): void {
        super.init();
        this.resolve(Monitor).register(this);
    }

    getAdditionalMonitorText(): string {
        let debugString = "mousePos:[";
        return debugString;
    }

    constructor(options: ObservableComponentOptions) {
        super({...options, key: GlobalMouseHandler});
        document.body.addEventListener("click", (event: MouseEvent) => this.onClick(event), false);
        document.addEventListener('pointerlockchange', (event: Event) => this.onPointerLockChange(event), false);
        document.body.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event), false);
    }

    onClick(event: MouseEvent) {
        if (!(document as any).pointerLockElement) {
            (document.body as any).requestPointerLock();
        }
    }

    onPointerLockChange(event: Event) {
        if ((document as any).pointerLockElement) {
            // acquire pointer lock
        } else {
            // release pointer lock
        }
    }

    onMouseMove(event: MouseEvent) {
        if ((document as any).pointerLockElement) {
            this.mouseMoveVector.x -= event.movementX/1000;
            this.mouseMoveVector.y -= event.movementY/1000;
        }
    }

    getMouseMove(): THREE.Vector2 {
        return this.mouseMoveVector.clone();
    }

    resetMouseMove() {
        this.mouseMoveVector.set(0,0);
    }
}
