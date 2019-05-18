import * as THREE from 'three';

/**
 * Converted to ts from C example included on http://paulbourke.net/geometry/circlesphere/
 */
export function lineSphereIntercepts(line: THREE.Line3, sphere: THREE.Sphere): THREE.Vector3[] {
    const p1 = line.start;
    const p2 = line.end;
    const r = sphere.radius;
    const sc = sphere.center;
    let a: number;
    let b: number;
    let c: number;
    let bb4ac: number;
    const dp = new THREE.Vector3();
    dp.x = p2.x - p1.x;
    dp.y = p2.y - p1.y;
    dp.z = p2.z - p1.z;
    a = dp.x * dp.x + dp.y * dp.y + dp.z * dp.z;
    b = 2 * (dp.x * (p1.x - sc.x) + dp.y * (p1.y - sc.y) + dp.z * (p1.z - sc.z));
    c = sc.x * sc.x + sc.y * sc.y + sc.z * sc.z;
    c += p1.x * p1.x + p1.y * p1.y + p1.z * p1.z;
    c -= 2 * (sc.x * p1.x + sc.y * p1.y + sc.z * p1.z);
    c -= r * r;
    bb4ac = b * b - 4 * a * c;
    const intercepts: THREE.Vector3[] = [];
    if (Math.abs(a) < Number.EPSILON || bb4ac < 0) {
        return intercepts;
    }
    const mu1 = (-b + Math.sqrt(bb4ac)) / (2 * a);
    if (mu1 >= 0 && mu1 <= 1) {
        const ip1 = p2.clone().sub(p1).multiplyScalar(mu1).add(p1);
        intercepts.push(ip1);
    }
    const mu2 = (-b - Math.sqrt(bb4ac)) / (2 * a);
    if (bb4ac != 0 && mu2 >= 0 && mu2 <= 1) {   // bb4ac==0 means tangent intercept so we ignore 2nd intercept because its the same point
        const ip2 = p2.clone().sub(p1).multiplyScalar(mu2).add(p1);
        intercepts.push(ip2);
    }
    return intercepts;
}