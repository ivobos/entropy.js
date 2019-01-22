import { SimStep } from "../engine/MainLoop";
import * as THREE from 'three';
import { WorldModel } from "../engine/WorldModel";
import { AbstractContainable } from "../container/AbstractContainable";
import { Container } from "../container/Container";


export class InfinitePattern extends AbstractContainable implements SimStep  {

    private gridHelper : THREE.GridHelper | undefined = undefined;

    constructor(container: Container) {
        super(container, InfinitePattern);
    }

    calculatePatternOffset() {
        var m4a = new THREE.Matrix3();
        var m4b = new THREE.Matrix3();
        m4a.set(1,0,0, 0,2,0, 0,0,1);
        console.log("m4a="+m4a.elements);
        console.log("m4b="+m4b.elements);
        m4b.getInverse(m4a);
        console.log("m4b.getInverse(m4a)");
        console.log("m4a="+m4a.elements);
        console.log("m4b="+m4b.elements);
        var v3 = new THREE.Vector3(20, 10, 0);
        console.log("v3="+v3.toArray());
        v3.applyMatrix3(m4b);
        console.log("v3="+v3.toArray());
    }

    simStep(simulationTimestep: number): void {
        if (this.gridHelper === undefined) {
            this.gridHelper = new THREE.GridHelper( 20, 40, 0x0000ff, 0x808080 );
            this.gridHelper.position.y = - 1;
            this.gridHelper.position.z = -10;
            this.resolve(WorldModel).addObject3D(this.gridHelper);
        }
    } 
    
}

