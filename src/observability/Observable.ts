import { MixinConstructor } from '../utils/MixinConstructor';
import { Observable } from './Monitor';

export interface ObserableOptions {
    key?: Function;         // constructor used to name this observable
    obsDetail?: Function;   // function returning detailed text of observable
}

export function ObservableMixin<TBase extends MixinConstructor>(Base: TBase) {
    return class extends Base implements Observable {

        key?: Function; 
        obsDetail?: Function;

        constructor(...args: any[]) {
            super(...args);
            const options = <ObserableOptions>args[0];
            this.key = options.key;
            this.obsDetail = options.obsDetail;
        }

        getMonitorText(): string {
            let result = this.getMonitorTextFor(this.key ?  this.key.name : "" , this);
            if (this.obsDetail) {
                result += this.obsDetail();
            }
            return result;
        }
    
        getMonitorTextFor(name: string, object: any) {
            let result = name+"( ";
            for (const key in object) {
                if (typeof object[key] === 'number' || typeof object[key] === 'boolean') {
                    result += " , "+key+"="+object[key];
                }
            }
            result += ") ";
            return result;        
        }
    
    };
}
