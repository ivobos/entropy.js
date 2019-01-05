import * as Random from 'random-js'

// import * as logging from "../utils/logging";
// import * as THREE from "three";

// import {
//     UNIT_NEG_X_VECTOR3, UNIT_NEG_Y_VECTOR3, UNIT_NEG_Z_VECTOR3, UNIT_POS_X_VECTOR3, UNIT_POS_Y_VECTOR3,
//     UNIT_POS_Z_VECTOR3
// } from "../utils/aaMaths";

// const log = logging.createLoggerFromFilename(__filename);

// LCG random number generator - https://en.wikipedia.org/wiki/Linear_congruential_generator
// function lcg() {
//     let random_number = (lcg.previous * lcg.a + lcg.c) % lcg.mod;
//     lcg.previous = random_number;
//     return random_number;
// }
// lcg.seedWithArray = function(array) {
//     let seed = 2222;
//     for (let x of array) {
//         seed =  (seed * lcg.a + lcg.c + x) % lcg.mod;
//     }
//     lcg.previous = seed;
// };
// lcg.previous = 2222;
// lcg.c = 12345;
// lcg.a = 1103515245;
// lcg.mod = 0xffffffff;

// lcg doesn't appear to be random enough
//let engine = lcg;
let engine = Random.engines.mt19937();
engine.seedWithArray([5,6,7,3]);

// export function seedWithVector3d(vector3d) {
//     let seed = [vector3d.x, vector3d.y, vector3d.z];
//     engine.seedWithArray(seed);
// }

// export function bool(percentage) {
//     let value = Random.bool(percentage)(engine);
//     return value;
// }

// export function seedWithString(string) {
//     engine.seedWithArray(Array.from(string));
// }

// export function seed(integer) {
//     engine.seed(integer);
// }

export function randInt(min: number, max: number) {
    return Random.integer(min, max)(engine);
}

export function randReal(min: number, max: number) {
    return Random.real(min, max)(engine);
}

// export function vector3(min, max) {
//     return new THREE.Vector3(
//         real(min, max),
//         real(min, max),
//         real(min, max)
//     );
// }

// const allAaUnitVector3s = [
//     UNIT_POS_X_VECTOR3, UNIT_NEG_X_VECTOR3,
//     UNIT_POS_Y_VECTOR3, UNIT_NEG_Y_VECTOR3,
//     UNIT_POS_Z_VECTOR3, UNIT_NEG_Z_VECTOR3,
// ];
// export function aaUnitVector3() {
//     return allAaUnitVector3s[integer(0,5)];
// }
