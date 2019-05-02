
/**
 * Used to hint to the object(s) how it/they should render
 * wireframe - display wireframe only
 * uvmaterial - use uvmaterial texture
 * polygonSize: ideal polygon size that should be used, has to be > 0
 * highlight: used for object selection
 */
export class RenderStyle {
    wireframe: boolean = false;
    uvmaterial: boolean = false;
    polygonSize: number = 30;
    highlight: boolean = false;

    clone(): RenderStyle {
        const clone: RenderStyle = Object.create(this);
        Object.assign(clone, this);
        return clone;
    }

    progressBoolAttributes(): void {
        // conver to gray code
        let gray = (this.wireframe ? 1 : 0)
                + (this.uvmaterial ? 2 : 0); 
                + (this.highlight ? 4 : 0); 
        // gray to number
        let n = gray ^ (gray >> 1) ^ ( gray >> 2);
        // increment
        n = (n + 1) % 8;
        // number to gray
        gray = n  ^ (n >> 1);
        // gray to attributes
        this.wireframe = (gray & 1) === 1; 
        this.uvmaterial = (gray & 2) === 2; 
        this.highlight = (gray & 4) === 4; 
    }

    polygonSizeMultiplyScalar(multiplier: number): void {
        this.polygonSize = Math.max(1, Math.min(100, Math.round(this.polygonSize * multiplier)))
    }

    equals(renderStyleProps: RenderStyle) : boolean {
        return this.wireframe === renderStyleProps.wireframe 
            && this.uvmaterial === renderStyleProps.uvmaterial
            && this.polygonSize === renderStyleProps.polygonSize
            && this.highlight === renderStyleProps.highlight;
    }

    toJSON(key: any): any {
        return { 
            wireframe: this.wireframe,
            uvmaterial: this.uvmaterial,
            polygonSize: this.polygonSize,
            highlight: this.highlight,
        };
    }
}