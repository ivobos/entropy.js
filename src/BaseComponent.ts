import { Container } from './Container';
import { Containable } from './Containable';
import { Monitorable } from './Monitor';

export abstract class BaseComponent implements Containable, Monitorable {

    // Monitorable interface
    getMonitorText(): string {
        let result = this.key.name+"( "+this.getAdditionalMonitorText()+" ";
        for (const key in this) {
            if (typeof this[key] === 'number' || typeof this[key] === 'boolean') {
                result += " , "+key+"="+this[key];
            }
        }
        result += ")";
        return result;
    }

    abstract getAdditionalMonitorText(): string;

    // Containable interface
    resolve(key: Function) {
        return this.container.resolve(key);
    }

    private container: Container;
    private key: Function;

    constructor(container: Container, key: Function) {
        this.container = container;
        this.key = key;
        container.register(key, this);
    }

}
