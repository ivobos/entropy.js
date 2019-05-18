import * as THREE from "three";
import { Monitor } from "../observability/Monitor";
import { AbstractComponent } from "../container/AbstractComponent";
import { ComponentOptions } from "../container/Component";


export class TextureCache extends AbstractComponent {

    private textureByUrl : Map<string, THREE.Texture>;
    private textureLoader: THREE.TextureLoader;

    constructor(container: ComponentOptions) {
        super({...container, key: TextureCache});
        this.textureByUrl = new Map();
        this.textureLoader = new THREE.TextureLoader();
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addMonitorEntry({ name: this.constructor.name, 
            content: () => this.monitorText() });
    }

    monitorText(): string {
        let debug = "Cache entries="+this.textureByUrl.size;
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
