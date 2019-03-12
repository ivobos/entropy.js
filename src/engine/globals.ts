import { Container } from "../container/Container";
import { TextureCache } from "../textures/TextureCache";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { GlobalMouseHandler } from "../input/GlobalMouseHandler";

export const container = new Container();
export const textureCache = new TextureCache({container: container});
export const globalKeyHandler = new GlobalKeyboardHandler({ container: container});
export const globalMouseHandler = new GlobalMouseHandler({ container: container});

