import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent'


export class GlobalMouseHandler extends AbstractObservableComponent {
    
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
            console.log("Movement="+event.movementX+","+event.movementY);
        }
    }
}
