import { BaseComponent } from "./BaseComponent";
import { Container } from "./Container";
import { MainLoop } from "./MainLoop";


export class Engine extends BaseComponent {

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        return "";
    }

    constructor(container: Container) {
        super(container, Engine);
    }

    start() {
        this.resolve(MainLoop).start();
    }

}
