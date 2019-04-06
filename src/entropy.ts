export  { VERSION } from './version';
export const NAME = "entropy-engine";
export { GraphicRenderer } from './rendering/GraphicRenderer';
export { CameraManager, CameraHolder } from './rendering/CameraManager';
export { MainLoop } from './engine/MainLoop';
export { Monitor } from './observability/Monitor';
export { AbstractComponent } from './container/AbstractComponent';
export { Container } from './container/Container';
export { ComponentOptions, ComponentMixin } from './container/Component';
export * from './utils/random';
export * from './utils/time';
export { GraphObject } from './graph/object/GraphObject';
export { PhysicalObject } from './graph/object/concerns/physics';
export { SelectableObject } from './graph/object/concerns/selection';
export { SimObjectOptions } from './graph/object/SimObjectOptions';
export { FocusManager } from './graph/object/FocusManager';
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
