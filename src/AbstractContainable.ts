import { Containable } from "./Containable";
import { Container } from "./Container";


export abstract class AbstractContainable implements Containable {

    private container: Container;
    private key: Function;

    constructor(container: Container, key: Function) {
        this.container = container;   
        this.key = key;
        this.container.register(key, this); 
    }

    resolve(key: Function) {
         return this.container.resolve(key);
    }
 
    getContainableKey() : Function {
        return this.key;
    }    
   
}
