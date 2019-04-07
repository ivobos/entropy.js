export  { VERSION } from './version';
export const NAME = "entropy-engine";
export { GraphicRenderer } from './rendering/GraphicRenderer';
export { CameraManager, CameraHolder } from './rendering/CameraManager';
export { MainLoop } from './engine/MainLoop';
export { Monitor } from './observability/Monitor';
export { AbstractComponent } from './container/AbstractComponent';
export { Container } from './container/Container';
export { ComponentOptions, ComponentMixin } from './container/Component';
export {  GraphObjectOptions, GraphObject } from './graph/node/object/graph-object';
export * from './utils/random';
export * from './utils/time';
export { FocusManager } from './input/FocusManager';
export { GlobalMouseHandler } from './input/GlobalMouseHandler';
export { GlobalKeyboardHandler } from './input/GlobalKeyboardHandler';
export { TextureCache } from './textures/TextureCache';
export { RenderStyle, RenderStyleProps } from './rendering/RenderStyle';
export { GraphManager } from './graph/GraphManager';
import { Builder } from './engine/Builder';

// import * as logging from './logging';

// const log = logging.createLoggerFromFilename(__filename);

export function builder(): Builder {
    return new Builder();
}
