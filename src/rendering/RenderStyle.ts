
/**
 * Used to hint to the object how it should render itself, including attributes such as
 * wireframe: boolean
 * detail: number (0,1,2...n 0 is minimal detail, each increment should correspond to doubling of detail)
 * flatshade: boolean
 */
export class RenderStyle {
    wireframe: boolean = false;
    uvmaterial: boolean = false;
    detail: number = 3;

    clone(): RenderStyle {
        const clone: RenderStyle = Object.create(this);
        Object.assign(clone, this);
        return clone;
    }

    progressBoolAttributes(): void {
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

    updateDetail(delta: number): void {
        this.detail = Math.max(0, Math.min(8, this.detail + delta));
    }

    equals(renderStyleProps: RenderStyle) : boolean {
        return this.wireframe === renderStyleProps.wireframe 
            && this.uvmaterial === renderStyleProps.uvmaterial
            && this.detail === renderStyleProps.detail;
    }

    toJSON(key: any): any {
        return { 
            wireframe: this.wireframe,
            uvmaterial: this.uvmaterial,
            detail: this.detail,
        };
    }
}