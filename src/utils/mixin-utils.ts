export type MixinConstructor<T = {}> = new (...args: any[]) => T;


export function includeMixin(object: any, mixin: any) {
    const prototype = mixin.prototype as any;
    for (let propName of Object.getOwnPropertyNames(mixin.prototype)) {
        object[propName] = prototype[propName];
     }
}