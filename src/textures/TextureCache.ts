import * as THREE from "three"
import { AbstractObservableComponent, ObservableComponentOptions } from "../container/AbstractObservableComponent";
import { Container } from "../container/Container";


export class TextureCache extends AbstractObservableComponent {

    private textureByUrl : Map<string, THREE.Texture>;
    private textureLoader: THREE.TextureLoader;

    constructor(container: ObservableComponentOptions) {
        super({...container, key: TextureCache});
        this.textureByUrl = new Map();
        this.textureLoader = new THREE.TextureLoader();
    }

    getAdditionalMonitorText(): string {
        let debug = "cache entries="+this.textureByUrl.size;
        for (const key of this.textureByUrl.keys()) {
            debug += ","+key;
        }
        return debug;
    }

    getFromUrl(url: string): THREE.Texture {
        if (this.textureByUrl.has(url)) {
            throw new Error("texture already loaded url:"+url);
        }
        const texture = this.textureLoader.load(url);
        this.textureByUrl.set(url, texture);
        return texture;
    }

}
