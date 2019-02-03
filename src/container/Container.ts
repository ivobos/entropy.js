

export class Container {

    private componentTypeType : Map<any, Object> = new Map();

    register(key: Function, component: Object) {
        return this.componentTypeType.set(key, component);
    }

    resolve<T>(key: new (arg: any) => T) : T {
        return <T>this.componentTypeType.get(key);
    }

}
