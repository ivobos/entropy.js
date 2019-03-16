export  { VERSION } from './version';
export const NAME = "entropy-engine";
export { HelloWorldCube } from './helloworld/HelloWorldCube';
export { GraphicRenderer } from './rendering/GraphicRenderer';
export { CameraHolder } from './rendering/CameraHolder';
export { MainLoop, LoopStartStep, SimStep, DrawStep, LoopEndStep } from './engine/MainLoop';
export { Monitor } from './observability/Monitor';
export { WorldModel } from './engine/WorldModel';
export { AbstractComponent } from './container/AbstractComponent';
export { Container } from './container/Container';
export { ComponentOptions, ComponentMixin } from './container/Component';
export { InfinitePattern } from './helloworld/InfinitePattern';
export { MapControlsSim } from './helloworld/MapControlsSim';
export { globalKeyHandler, globalMouseHandler } from './engine/globals';
export * from './utils/random';
export * from './utils/time';
export { PhysicalObjectOptions, PhysicalObject } from './model/PhysicalObject';
export { FocusedObject } from './model/FocusedObject';

import { Builder } from './engine/Builder';
// import * as logging from './logging';

// const log = logging.createLoggerFromFilename(__filename);

export function builder(): Builder {
    return new Builder();
}
