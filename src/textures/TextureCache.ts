import * as THREE from "three"
import { AbstractObservableComponent, ObservableComponentOptions } from "../container/AbstractObservableComponent";
import { Container } from "../container/Container";
import { Monitor } from "../observability/Monitor";


export class TextureCache extends AbstractObservableComponent {

    private textureByUrl : Map<string, THREE.Texture>;
    private textureLoader: THREE.TextureLoader;

    constructor(container: ObservableComponentOptions) {
        super({...container, key: TextureCache});
        this.textureByUrl = new Map();
        this.textureLoader = new THREE.TextureLoader();
    }

    init(): void {
        super.init();
        this.resolve(Monitor).register(this);
    }

    getAdditionalMonitorText(): string {
        let debug = "cache entries="+this.textureByUrl.size;
        for (const key of this.textureByUrl.keys()) {
            debug += ","+key;
        }
        return debug;
    }

    getFromUrl(url: string): THREE.Texture {
        let texture = this.textureByUrl.get(url);
        if (texture) return texture;
        texture = this.textureLoader.load(url);
        this.textureByUrl.set(url, texture);
        return texture;
    }

}
