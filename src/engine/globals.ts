import { Container } from "../container/Container";
import { TextureCache } from "../textures/TextureCache";

export const container = new Container();
export const textureCache = new TextureCache(container);

