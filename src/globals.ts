import { Container } from "./Container";
import { TextureCache } from "./TextureCache";

export const container = new Container();
export const textureCache = new TextureCache(container);

