export  { VERSION } from './version';
export const NAME = "entropy-engine";
export { HelloWorldCube } from './helloworld/HelloWorldCube';
export { GraphicRenderer } from './rendering/GraphicRenderer';
export { MainLoop, NoopSim } from './engine/MainLoop';
export { Monitor } from './observability/Monitor';
export { WorldModel } from './engine/WorldModel';
export { Container } from './container/Container';
export { HelloWorldSimulation } from './helloworld/HelloWorldSimulation'; 
export { RenderSim } from './rendering/RenderSim';
export { InfinitePattern } from './helloworld/InfinitePattern';
export { MapControlsSim } from './helloworld/MapControlsSim';
export * from './utils/random';
export * from './utils/time';

import { Builder } from './engine/Builder';
// import * as logging from './logging';

// const log = logging.createLoggerFromFilename(__filename);


export function builder() {
    return new Builder();
}

