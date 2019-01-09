import { BaseComponent } from '../container/BaseComponent'
import { Container } from '../container/Container';

export class GlobalKeyboardHandler extends BaseComponent {
    private keyMap:{ [index:string] : boolean } = {};
    private keyHandlers:{ [index:string] : any } = {};
    
    getAdditionalMonitorText(): string {
        let debugString = "pressedKeys:[";
        Object.keys(this.keyMap).forEach((key) => debugString=debugString+key)
        debugString+="]";
        return debugString;
    }

    constructor(container: Container) {
        super(container, GlobalKeyboardHandler);
        document.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDownCb(event), false);
        document.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUpCb(event), false);
    }

    isKeyDown(key: any) {
        return key in this.keyMap;
    }

    registerKey(key: any, handler: any) {
        this.keyHandlers[key] = handler;
    }

    onKeyDownCb(event: KeyboardEvent) {
        // console.log("onkdown");
        if (event.target === document.body) {
            this.keyMap[event.key] = true;
            if (this.keyHandlers[event.key]) {
                this.keyHandlers[event.key]();
           }
        }
    }

    onKeyUpCb(event: KeyboardEvent) {
        // console.log("onkup");
        if (event.target === document.body) {
            delete this.keyMap[event.key];
        }
    }
}

