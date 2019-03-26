

export interface RenderStyleProps {
    wireframe?: boolean;
    uvmaterial?: boolean;
}

/**
 * Used to hint to the object how it should render itself, including attributes such as
 * wireframe: boolean
 * detail: number (0-1 where 0 is minimal detail and 1 is maximum details)
 * flatshade: boolean
 */
export class RenderStyle implements RenderStyleProps {
    wireframe: boolean = false;
    uvmaterial: boolean = false;

    constructor(renderStyleProps: RenderStyleProps) {
        Object.assign(this, renderStyleProps);
    }

    progress(): void {
        // conver to gray code
        let gray = (this.wireframe ? 1 : 0)
                + (this.uvmaterial ? 2 : 0); 
        // gray to number
        let n = gray ^ (gray >> 1) ^ ( gray >> 2);
        // increment
        n = (n + 1) % 4;
        // number to gray
        gray = n  ^ (n >> 1);
        // gray to attributes
        this.wireframe = (gray & 1) === 1; 
        this.uvmaterial = (gray & 2) === 2; 
    }

    equals(renderStyleProps: RenderStyleProps) : boolean {
        return this.wireframe === renderStyleProps.wireframe 
            && this.uvmaterial === renderStyleProps.uvmaterial;
    }

    toJSON(key: any): any {
        return { 
            wireframe: this.wireframe,
            uvmaterial: this.uvmaterial,
        };
    }
}