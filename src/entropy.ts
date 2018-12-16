export  { VERSION } from './version';
export const NAME = "entropy-engine";
export * from './globals';
export { HelloWorldCube } from './HelloWorldCube';
export * from './random';
export * from './time';

import { time_init } from './time';

export function init() {
    time_init();
}
