import { textureCache } from '../engine/globals';
import image_url from './UV_Grid_Sm.jpg';
const texure: THREE.Texture = textureCache.getFromUrl(image_url);
export default texure;