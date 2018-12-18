

export class Container {

    private componentTypeType : Map<Function, Object> = new Map();

    register(key: Function, component: Object) {
        return this.componentTypeType.set(key, component);
    }

    resolve(key: Function) : any {
        return this.componentTypeType.get(key);
    }


}