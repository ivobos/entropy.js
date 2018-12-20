import { NoopSim } from "./MainLoop";
import * as THREE from 'three';
import { WorldModel } from "./WorldModel";


export class InfinitePattern extends NoopSim {

    private gridHelper : THREE.GridHelper | undefined = undefined;

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

    update(simulationTimestep: number): void {
        if (this.gridHelper === undefined) {
            this.gridHelper = new THREE.GridHelper( 20, 40, 0x0000ff, 0x808080 );
            this.gridHelper.position.y = - 1;
            this.gridHelper.position.z = -10;
            this.resolve(WorldModel).addObject3D(this.gridHelper);
        }
    } 
    
}

