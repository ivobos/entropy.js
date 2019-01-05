import { Container } from './Container';
import { Containable } from './Containable';
import { Monitorable } from '../observability/Monitor';
import { AbstractContainable } from './AbstractContainable';

export abstract class BaseComponent extends AbstractContainable implements Monitorable {

    // Monitorable interface
    getMonitorText(): string {
        let result = this.getMonitorTextFor(super.getContainableKey(), this);
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

}
