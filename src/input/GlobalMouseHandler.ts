import * as THREE from "three";
import { Monitor } from '../observability/Monitor';
import { AbstractComponent } from '../container/AbstractComponent';
import { ComponentOptions } from '../container/Component';

export class GlobalMouseHandler extends AbstractComponent {
    private mouseMoveVector = new THREE.Vector2();
    private clicked = false;

    init(): void {
        super.init();
        this.resolve(Monitor).addMonitorEntry({ 
            name: this.constructor.name, 
            infoContent: () => "mouseMove="+JSON.stringify(this.mouseMoveVector)});
    }

    constructor(options: ComponentOptions) {
        super({...options, key: GlobalMouseHandler});
        document.body.addEventListener("click", (event: MouseEvent) => this.onClick(event), false);
        document.addEventListener('pointerlockchange', (event: Event) => this.onPointerLockChange(event), false);
        document.body.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event), false);
    }

    onClick(event: MouseEvent) {
        if (!(document as any).pointerLockElement) {
            (document.body as any).requestPointerLock();
        } else {
            this.clicked = true;
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

    takeMouseMove(): THREE.Vector2 {
        const mouseMove = this.mouseMoveVector.clone();
        this.mouseMoveVector.set(0,0);
        return mouseMove;
    }

    takeMouseClick(): boolean {
        const wasClicked = this.clicked;
        this.clicked = false;
        return wasClicked;
    }
}
