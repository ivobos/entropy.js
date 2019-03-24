

export class RenderStyleProps {
    wireframe: boolean = false;
}

/**
 * Used to hint to the object how it should render itself, including attributes such as
 * wireframe: boolean
 * detail: number (0-1 where 0 is minimal detail and 1 is maximum details)
 * flatshade: boolean
 */
export class RenderStyle extends RenderStyleProps {
    wireframe: boolean = false;

    constructor(renderStyleProps: RenderStyleProps) {
        super();
        Object.assign(this, renderStyleProps);
    }

    equals(renderStyleProps: RenderStyleProps) : boolean {
        return this.wireframe === renderStyleProps.wireframe;
    }

}