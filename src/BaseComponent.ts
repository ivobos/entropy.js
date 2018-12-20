import { Container } from './Container';
import { Containable } from './Containable';
import { Monitorable } from './Monitor';

export abstract class BaseComponent implements Containable, Monitorable {

    // Monitorable interface
    getMonitorText(): string {
        let result = this.getMonitorTextFor(this.key, this);
        result += this.getAdditionalMonitorText();
        return result;
    }

    getMonitorTextFor(key: Function, object: any) {
        let result = key.name+"( ";
        for (const key in object) {
            if (typeof object[key] === 'number' || typeof object[key] === 'boolean') {
                result += " , "+key+"="+object[key];
            }
        }
        result += ") ";
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
