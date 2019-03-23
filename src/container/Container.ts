

export class Container {

    private componentTypeType : Map<any, Object> = new Map();

    initComponents(): void {
        this.componentTypeType.forEach( component => (<any>component).init() );
    }

    register(key: Function, component: Object): void {
        this.componentTypeType.set(key, component);
    }

    resolve<T>(key: new (arg: any) => T) : T {
        return <T>this.componentTypeType.get(key);
    }

}
