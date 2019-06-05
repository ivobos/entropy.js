export type MixinConstructor<T = {}> = new (...args: any[]) => T;


export function includeMixin(object: any, mixin: any) {
    const prototype = mixin.prototype as any;
    for (let propName of Object.getOwnPropertyNames(mixin.prototype)) {
        if (propName === 'toJSON' && typeof object[propName] === 'function') {
            const originalToJSON = object[propName].bind(object);
            const mixinToJSON = prototype[propName].bind(object);
            object[propName] = function(key: any) {
                return Object.assign({}, originalToJSON(key), mixinToJSON(key));
            }
        } else {
            object[propName] = prototype[propName];
        }
     }
}
