import { AbstractObservableComponent, ObservableComponentOptions } from "../container/AbstractObservableComponent";
import { PhysicalObject } from "./PhysicalObject";



export class FocusedObject extends AbstractObservableComponent {

    private focusedObject!: PhysicalObject;

    constructor(options: ObservableComponentOptions) {
        super({...options, key: FocusedObject});
    }

    getAdditionalMonitorText(): string {
        if (!this.focusedObject) return "not focused";
        return this.focusedObject.constructor.name+" "+JSON.stringify(this.focusedObject);
    }

    setFocusOn(obj: PhysicalObject) {
        this.focusedObject = obj;
    }
}