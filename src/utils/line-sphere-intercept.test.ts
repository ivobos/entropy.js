import * as THREE from 'three';
import { lineSphereIntercepts } from './line-sphere-intercept';

test('line from center of sphere intercepts once', () => {
    const result = lineSphereIntercepts(
        new THREE.Line3(new THREE.Vector3(0,0,0), new THREE.Vector3(2,0,0)), 
        new THREE.Sphere(new THREE.Vector3(0,0,0), 1)
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(new THREE.Vector3(1,0,0));
});

test('line tangent intercepts once', () => {
    const result = lineSphereIntercepts(
        new THREE.Line3(new THREE.Vector3(1,-1,0), new THREE.Vector3(1,1,0)), 
        new THREE.Sphere(new THREE.Vector3(0,0,0), 1)
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(new THREE.Vector3(1,0,0));
});

test('line through center with both endpoints far away intercepts twice', () => {
    const result = lineSphereIntercepts(
        new THREE.Line3(new THREE.Vector3(-2,0,0), new THREE.Vector3(2,0,0)), 
        new THREE.Sphere(new THREE.Vector3(0,0,0), 1)
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(new THREE.Vector3(1,0,0));
    expect(result[1]).toEqual(new THREE.Vector3(-1,0,0));
});

test('line inside sphere doesnt intercept', () => {
    const result = lineSphereIntercepts(
        new THREE.Line3(new THREE.Vector3(-.5,0,0), new THREE.Vector3(.5,0,0)), 
        new THREE.Sphere(new THREE.Vector3(0,0,0), 1)
    );
    expect(result).toHaveLength(0);
});

