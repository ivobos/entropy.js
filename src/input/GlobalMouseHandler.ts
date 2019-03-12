import { AbstractObservableComponent, ObservableComponentOptions } from '../container/AbstractObservableComponent'


export class GlobalMouseHandler extends AbstractObservableComponent {
    
    getAdditionalMonitorText(): string {
        let debugString = "mousePos:[";
        return debugString;
    }

    constructor(options: ObservableComponentOptions) {
        super({...options, key: GlobalMouseHandler});
    }

}
