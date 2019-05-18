import { GraphNode } from "../graph/node/graph-node";
import { Monitor } from "../observability/Monitor";
import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";
import { SelectableObject } from "../graph/node/object/concerns/selection";


export class FocusManager extends AbstractComponent {
    private focusedObject: GraphNode | undefined;

    constructor(options: ComponentOptions) {
        super({...options, key: FocusManager});
        
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addMonitorEntry({ 
            name: this.constructor.name,
            weight: 20, 
            content: () => this.monitorText(), 
        });
    }

    monitorText(): string {
        if (!this.focusedObject) return "Looking at: empty space";
        return "Looking at: "+JSON.stringify(this.focusedObject);
    }

    setFocusOn(graphNode?: GraphNode) {
        if (this.focusedObject !== graphNode) {
            if (this.focusedObject) (this.focusedObject as SelectableObject).setSelected(false);
            this.focusedObject = graphNode;
            if (this.focusedObject) (this.focusedObject as SelectableObject).setSelected(true);
        }
    }

}