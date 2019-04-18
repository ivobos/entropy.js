export  { VERSION } from './version';
export const NAME = "entropy-engine";
export { CameraHolder } from './rendering/CameraManager';
export { Container } from './container/Container';
export { GraphObjectOptions, GraphObject } from './graph/node/object/graph-object';
export * from './utils/random';
export * from './utils/time';
export { GlobalMouseHandler } from './input/GlobalMouseHandler';
export { GlobalKeyboardHandler } from './input/GlobalKeyboardHandler';
export { TextureCache } from './textures/TextureCache';
export { RenderStyle } from './rendering/RenderStyle';
export { GraphManager } from './graph/GraphManager';
import { Builder } from './engine/Builder';

export function builder(): Builder {
    return new Builder();
}
