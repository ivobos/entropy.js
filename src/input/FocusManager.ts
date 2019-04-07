import { GraphNode } from "../graph/node/graph-node";
import * as THREE from 'three';
import { CameraManager } from "../rendering/CameraManager";
import { Monitor } from "../observability/Monitor";
import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { GraphicRenderer } from "../rendering/GraphicRenderer";
import { SelectableObject } from "../graph/node/object/concerns/selection";


export class FocusManager extends AbstractComponent {
    private focusedObject: GraphNode | undefined;

    constructor(options: ComponentOptions) {
        super({...options, key: FocusManager});
        
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this, additionalText: () => this.monitorText() });
    }

    monitorText(): string {
        if (!this.focusedObject) return "not focused";
        return this.focusedObject.constructor.name+" "+JSON.stringify(this.focusedObject);
    }

    setFocusOn(graphNode?: GraphNode) {
        if (this.focusedObject !== graphNode) {
            if (this.focusedObject) (this.focusedObject as SelectableObject).setSelected(false);
            this.focusedObject = graphNode;
            if (this.focusedObject) (this.focusedObject as SelectableObject).setSelected(true);
        }
    }

}