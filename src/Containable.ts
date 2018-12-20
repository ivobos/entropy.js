import { Container } from "./Container";


export interface Containable {
    
    resolve(key: Function) : any;
    
}

