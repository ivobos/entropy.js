import { BeforeDrawStep } from "../engine/MainLoop";
import * as THREE from 'three';
import { CameraManager } from "./CameraManager";
import { RenderStyle, RenderStyleProps } from "./RenderStyle";
import { Monitor } from "../observability/Monitor";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { ComponentOptions } from "../container/Component";
import { AbstractComponent } from "../container/AbstractComponent";


export class SceneManager extends AbstractComponent implements BeforeDrawStep {
    
    private scene : THREE.Scene;
    private renderStyle: RenderStyle = new RenderStyle({});

    constructor(options: ComponentOptions) {
        super({...options, key: SceneManager});
        this.scene = new THREE.Scene();
        this.scene.userData.changed = true;
    }

    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this, additionalText: () => this.monitorText() });
        this.resolve(GlobalKeyboardHandler).registerKey('x', () => this.renderStyle.progress());
    }

    monitorText(): string {
        return "scene.children="+this.scene.children.length+" renderStyle="+JSON.stringify(this.renderStyle);
    }

    beforeDrawStep(interpolationPercentage: number): void {
        const cameraHolder = this.resolve(CameraManager).getCameraHolder();
        if (cameraHolder) {
            for (const object3d of cameraHolder.getReachableObjects()) {
                object3d.updateRenderStyle(this.renderStyle);
                if (!this.scene.children.includes(object3d)) {
                    this.scene.add(object3d);
                }
            }
        }   
    }

    getScene() : THREE.Scene {
        return this.scene;
    }

}

