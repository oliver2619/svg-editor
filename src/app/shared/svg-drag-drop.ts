import { Subject } from "rxjs";

export interface SvgDragDropBeginEvent {
    readonly element: SVGElement;
    readonly x: number;
    readonly y: number;
    readonly ctrlKey: boolean,
    readonly shiftKey: boolean,
    readonly altKey: boolean

    cancel(): void;
}

export interface SvgDragDropEvent {
    readonly element: SVGElement;
    readonly x: number;
    readonly y: number;
    readonly ctrlKey: boolean,
    readonly shiftKey: boolean,
    readonly altKey: boolean
}

export class SvgDragDrop {

    readonly onDragBegin = new Subject<SvgDragDropBeginEvent>();
    readonly onDragOver = new Subject<SvgDragDropEvent>();
    readonly onDragEnd = new Subject<SvgDragDropEvent>();

    private readonly elements: SVGElement[] = [];
    private currentElement: SVGElement | undefined;

    private onPointerDown = (ev: PointerEvent) => {
        if (ev.button !== 0) {
            return;
        }
        this.currentElement = (ev.target as SVGElement);
        let cancelled = false;
        const ddEvent: SvgDragDropBeginEvent = {
            element: this.currentElement,
            cancel: () => cancelled = true,
            x: ev.offsetX,
            y: ev.offsetY,
            ctrlKey: ev.ctrlKey,
            shiftKey: ev.shiftKey,
            altKey: ev.altKey
        };
        this.onDragBegin.next(ddEvent);
        if (!cancelled) {
            this.currentElement.ownerSVGElement?.setPointerCapture(ev.pointerId);
            this.currentElement.ownerSVGElement?.addEventListener('pointermove', this.onPointerMove);
            this.currentElement.ownerSVGElement?.addEventListener('pointerup', this.onPointerUp);
        }
    };

    private onPointerMove = (ev: PointerEvent) => {
        this.onDragOver.next({
            element: this.currentElement!,
            x: ev.offsetX,
            y: ev.offsetY,
            ctrlKey: ev.ctrlKey,
            shiftKey: ev.shiftKey,
            altKey: ev.altKey
        });
    };

    private onPointerUp = (ev: PointerEvent) => {
        this.currentElement?.ownerSVGElement?.releasePointerCapture(ev.pointerId);
        this.currentElement?.ownerSVGElement?.removeEventListener('pointermove', this.onPointerMove);
        this.currentElement?.ownerSVGElement?.removeEventListener('pointerup', this.onPointerUp);
        this.onDragEnd.next({
            element: this.currentElement!,
            x: ev.offsetX,
            y: ev.offsetY,
            ctrlKey: ev.ctrlKey,
            shiftKey: ev.shiftKey,
            altKey: ev.altKey
        });
        this.currentElement = undefined;
    };

    addElement(el: SVGElement) {
        this.elements.push(el);
        el.addEventListener('pointerdown', this.onPointerDown);
    }

    clearElements() {
        this.elements.slice(0).forEach(e => this.removeElement(e));
    }

    removeElement(el: SVGElement) {
        const i = this.elements.findIndex(e => e === el);
        if (i >= 0) {
            el.removeEventListener('pointerdown', this.onPointerDown);
            this.elements.splice(i, 1);
        }
    }
}