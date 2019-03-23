import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent'

export class GlobalKeyboardHandler extends AbstractObservableComponent {
    private keyMap:{ [index:string] : boolean } = {};
    private keyHandlers:{ [index:string] : any } = {};
    
    getAdditionalMonitorText(): string {
        let debugString = "downKeys:[";
        Object.keys(this.keyMap).forEach((key) => debugString=debugString+key)
        debugString+="]";
        return debugString;
    }

    constructor(options: ObservableComponentOptions) {
        super({...options, key: GlobalKeyboardHandler});
        document.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDownCb(event), false);
        document.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUpCb(event), false);
        document.addEventListener('keypress', (event: KeyboardEvent) => this.onKeyPressCb(event), false);
    }

    isKeyDown(key: any) {
        return key in this.keyMap;
    }

    registerKey(key: any, handler: any) {
        if (key in this.keyHandlers) {
            throw Error("key "+key+" already registered");
        }
        this.keyHandlers[key] = handler;
    }

    onKeyDownCb(event: KeyboardEvent) {
        // console.log("onkdown");
        if (event.target === document.body) {
            this.keyMap[event.key] = true;
        }
    }

    onKeyUpCb(event: KeyboardEvent) {
        // console.log("onkup");
        if (event.target === document.body) {
            delete this.keyMap[event.key];
        }
    }

    onKeyPressCb(event: KeyboardEvent) {
        if (event.target === document.body) {
            if (this.keyHandlers[event.key]) {
                this.keyHandlers[event.key]();
            }
        }
    }
}

