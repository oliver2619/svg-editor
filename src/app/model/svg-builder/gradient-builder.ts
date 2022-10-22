import { SpreadMethod } from "../color/gradient";

export abstract class GradientBuilder {

    abstract readonly element: SVGGradientElement;

    addColorStop(offset: number, color: string, opacity?: number) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        this.element.appendChild(el);
        el.offset.baseVal = offset;
        el.setAttribute('stop-color', color);
        if (opacity !== undefined && opacity !== 1) {
            el.setAttribute('stop-opacity', String(opacity));
        }
        return this;
    }

    clearColorStops() {
        this.element.innerHTML = '';
    }

    setSpreadMethod(spreadMethod: SpreadMethod) {
        if (spreadMethod === 'pad') {
            this.element.removeAttribute('spreadMethod');
        } else {
            this.element.setAttribute('spreadMethod', spreadMethod);
        }
        return this;
    }

    setUserSpaceOnUse(userSpace: boolean) {
        if (userSpace) {
            this.element.setAttribute('gradientUnits', 'userSpaceOnUse');
        } else {
            this.element.removeAttribute('gradientUnits');
        }
    }
}