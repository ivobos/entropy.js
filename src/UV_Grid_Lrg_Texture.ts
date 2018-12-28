import { textureCache } from './globals';
import image_url from './UV_Grid_Lrg.jpg';
const texture: THREE.Texture = textureCache.getFromUrl(image_url);
export default texture;