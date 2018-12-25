export  { VERSION } from './version';
export const NAME = "entropy-engine";
export { HelloWorldCube } from './HelloWorldCube';
export { GraphicRenderer } from './GraphicRenderer';
export { MainLoop, NoopSim } from './MainLoop';
export { Monitor } from './Monitor';
export { WorldModel } from './WorldModel';
export { Container } from './Container';
export { HelloWorldSimulation } from './HelloWorldSimulation'; 
export { RenderSim } from './RenderSim';
export { InfinitePattern } from './InfinitePattern';
export { MapControlsSim } from './MapControlsSim';
export * from './random';
export * from './time';

import { Builder } from './Builder';
// import * as logging from './logging';

// const log = logging.createLoggerFromFilename(__filename);


export function builder() {
    return new Builder();
}

