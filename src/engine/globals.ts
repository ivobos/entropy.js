import { Container } from "../container/Container";
import { TextureCache } from "../textures/TextureCache";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";

export const container = new Container();
export const textureCache = new TextureCache(container);
export const globalKeyHandler = new GlobalKeyboardHandler(container);


