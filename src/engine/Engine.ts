import { BaseComponent } from "../container/BaseComponent";
import { Container } from "../container/Container";
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
