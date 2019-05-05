import { Container } from './Container';
import { MixinConstructor } from '../utils/mixin-utils';

export interface ComponentOptions {
    container: Container,   // container that holds everything
    key?: Function          // constructor used to find this component
}

export function ComponentMixin<TBase extends MixinConstructor>(Base: TBase) {
    return class extends Base {
        /*private*/ container: Container; // can't use private because https://github.com/Microsoft/TypeScript/issues/17293
        
        constructor(...args: any[]) {
            super(...args);
            const options = <ComponentOptions>args[0];
            this.container = options.container;
            if (options.key) {
                this.container.register(options.key, this);
            }
        }

        init(): void {
        };
    
        resolve<T extends {}>(key: new (args: any) => T) : T {
            return <T>this.container.resolve(key);
        }

    };
}
