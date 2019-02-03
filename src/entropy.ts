export  { VERSION } from './version';
export const NAME = "entropy-engine";
export { HelloWorldCube } from './helloworld/HelloWorldCube';
export { GraphicRenderer } from './rendering/GraphicRenderer';
export { MainLoop, SimStep } from './engine/MainLoop';
export { Monitor } from './observability/Monitor';
export { ShowDebug } from './observability/ShowDebug';
export { WorldModel } from './engine/WorldModel';
export { AbstractComponent } from './container/AbstractComponent';
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


export function builder(): Builder {
    return new Builder();
}
