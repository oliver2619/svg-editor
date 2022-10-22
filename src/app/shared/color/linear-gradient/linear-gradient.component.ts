import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorStop } from 'src/app/model/color/color-stop';
import { SpreadMethod } from 'src/app/model/color/gradient';
import { SingleColor } from 'src/app/model/color/single-color';
import { Coordinate } from 'src/app/model/coordinate';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { LinearGradientBuilder } from 'src/app/model/svg-builder/linear-gradient-builder';
import { RectBuilder } from 'src/app/model/svg-builder/rect-builder';
import { SvgDragDrop } from '../../svg-drag-drop';
import { ColorService } from '../color.service';

interface LinearGradientComponentValue {
  spreadMethod: SpreadMethod;
  opacity: number;
}

@Component({
  selector: 'se-linear-gradient',
  templateUrl: './linear-gradient.component.html',
  styleUrls: ['./linear-gradient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinearGradientComponent implements AfterViewInit {

  @ViewChild('rect')
  rectElement: ElementRef<SVGRectElement> | undefined;
  @ViewChild('gradient')
  gradient: ElementRef<SVGLinearGradientElement> | undefined;
  @ViewChild('gradient2')
  gradient2: ElementRef<SVGLinearGradientElement> | undefined;
  @ViewChild('colorStops')
  colorStopsElement: ElementRef<SVGGElement> | undefined;
  @ViewChild('start')
  startElement: ElementRef<SVGCircleElement> | undefined;
  @ViewChild('end')
  endElement: ElementRef<SVGCircleElement> | undefined;

  formGroup: FormGroup;

  private readonly colorStops: ColorStop[] = [new ColorStop({ offset: 0, color: new SingleColor(1, 0, 0, .5) }), new ColorStop({ offset: 1, color: new SingleColor(1, 1, 0, 1) })];
  private readonly colorStopElements: SVGCircleElement[] = [];
  private readonly dragDrop = new SvgDragDrop();
  private readonly dragDrop2 = new SvgDragDrop();
  private readonly start = new Coordinate(0, 0);
  private readonly end = new Coordinate(1, 0);
  private gradientBuilder: LinearGradientBuilder | undefined;
  private gradientBuilder2: LinearGradientBuilder | undefined;
  private rectBuilder: RectBuilder | undefined;
  private colorStopsBuilder: GroupBuilder | undefined;

  private get value(): LinearGradientComponentValue { return this.formGroup.value; }

  private set value(v: LinearGradientComponentValue) { this.formGroup.setValue(v); }

  constructor(private readonly colorService: ColorService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('spreadMethod', formBuilder.control('pad', Validators.required));
    this.formGroup.addControl('opacity', formBuilder.control(100, Validators.required));
    this.dragDrop.onDragOver.subscribe({
      next: (ev) => {
        let x = ev.x;
        let y = ev.y;
        const isStartElement = ev.element === this.startElement?.nativeElement;
        if (ev.shiftKey) {
          const sx = (isStartElement ? this.end.x : this.start.x) * 320 + 60;
          const sy = (isStartElement ? this.end.y : this.start.y) * 320 + 60;
          const dx = x - sx;
          const dy = y - sy;
          const dd = dx * dx + dy * dy;
          if (dd > 0) {
            const angle = Math.round(360 + Math.atan2(dy, dx) * 180 / (15 * Math.PI)) * 15 * Math.PI / 180;
            const d = Math.sqrt(dd);
            x = sx + d * Math.cos(angle);
            y = sy + d * Math.sin(angle);
          }
        }
        x = ev.ctrlKey ? Math.max(60, Math.min(380, x)) : Math.max(0, Math.min(440, x));
        y = ev.ctrlKey ? Math.max(60, Math.min(380, y)) : Math.max(0, Math.min(440, y));
        if (isStartElement) {
          this.startElement!.nativeElement.cx.baseVal.value = x;
          this.startElement!.nativeElement.cy.baseVal.value = y;
          this.start.x = (x - 60) / 320;
          this.start.y = (y - 60) / 320;
          this.updateSvg();
        } else {
          this.endElement!.nativeElement.cx.baseVal.value = x;
          this.endElement!.nativeElement.cy.baseVal.value = y;
          this.end.x = (x - 60) / 320;
          this.end.y = (y - 60) / 320;
          this.updateSvg();
        }
      }
    });
    this.dragDrop2.onDragOver.subscribe({
      next: (ev) => {
        const x = Math.max(20, Math.min(420, ev.x));
        const i = this.colorStopElements.findIndex(c => c === ev.element);
        if (i >= 0) {
          this.colorStops[i].offset = (x - 20) / 400;
          this.colorStopElements[i].cx.baseVal.value = x;
          this.updateSvg();
        }
      }
    });
    this.dragDrop2.onDragEnd.subscribe({
      next: (ev) => {
        if ((ev.y < -10 || ev.y > 42) && this.colorStops.length > 2) {
          const i = this.colorStopElements.findIndex(c => c === ev.element);
          if (i >= 0) {
            this.colorStops.splice(i, 1);
            this.updateSvgColorStops();
            this.updateSvg();
          }
        } else {
          this.sortColorStops();
          this.updateSvgColorStops();
          this.updateSvg();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.gradient !== undefined) {
      this.gradientBuilder = new LinearGradientBuilder(this.gradient.nativeElement);
    }
    if (this.gradient2 !== undefined) {
      this.gradientBuilder2 = new LinearGradientBuilder(this.gradient2.nativeElement);
    }
    if (this.rectElement !== undefined) {
      this.rectBuilder = new RectBuilder(this.rectElement.nativeElement);
    }
    if (this.startElement !== undefined) {
      this.dragDrop.addElement(this.startElement.nativeElement);
    }
    if (this.endElement !== undefined) {
      this.dragDrop.addElement(this.endElement.nativeElement);
    }
    if (this.colorStopsElement !== undefined) {
      this.colorStopsBuilder = new GroupBuilder(this.colorStopsElement.nativeElement);
    }
    this.updateSvg();
    this.updateSvgColorStops();
  }

  onChangeOpacity() {
    this.updateSvg();
  }

  onChangeSpreadMethod() {
    this.updateSvg();
  }

  onInsertStop(ev: PointerEvent) {
    this.colorStops.push(new ColorStop({ offset: (ev.offsetX - 20) / 420, color: new SingleColor(1, 1, 1, 1) }));
    this.sortColorStops();
    this.updateSvgColorStops();
    this.updateSvg();
  }

  private updateSvg() {
    const v = this.value;
    if (this.rectBuilder !== undefined) {
      this.rectBuilder.setFillOpacity(v.opacity / 100);
    }
    if (this.gradientBuilder !== undefined) {
      this.gradientBuilder.setPath(this.start, this.end);
      this.gradientBuilder.setSpreadMethod(v.spreadMethod);
      this.gradientBuilder.clearColorStops();
      this.colorStops.forEach(s => s.build(this.gradientBuilder!));
    }
    if (this.gradientBuilder2 !== undefined) {
      this.gradientBuilder2.setPath(new Coordinate(0, 0), new Coordinate(1, 0))
      this.gradientBuilder2.setSpreadMethod('pad');
      this.gradientBuilder2.clearColorStops();
      this.colorStops.forEach(s => s.build(this.gradientBuilder2!));
    }
    if (this.startElement !== undefined) {
      this.startElement.nativeElement.cx.baseVal.value = 60 + 320 * this.start.x;
      this.startElement.nativeElement.cy.baseVal.value = 60 + 320 * this.start.y;
    }
    if (this.endElement !== undefined) {
      this.endElement.nativeElement.cx.baseVal.value = 60 + 320 * this.end.x;
      this.endElement.nativeElement.cy.baseVal.value = 60 + 320 * this.end.y;
    }
  }

  private updateSvgColorStops() {
    if (this.colorStopsBuilder !== undefined) {
      this.colorStopsBuilder.clearShapes();
      this.dragDrop2.clearElements();
      this.colorStopElements.splice(0, this.colorStopElements.length);
      this.colorStops.forEach(s => {
        const c = this.colorStopsBuilder!.circle(20 + s.offset * 400, 16, 10);
        c.setStrokeColor('black');
        c.setStrokeWidth(2);
        c.setFillColor(s.color.html);
        c.setFillOpacity(s.color.alpha);
        c.setAttribute('style', 'cursor: move');
        this.dragDrop2.addElement(c.element);
        this.colorStopElements.push(c.element);
        c.element.addEventListener('pointerdown', (ev: PointerEvent) => {
          if (ev.button === 2) {
            this.editColor(c.element);
          }
        });
      });
    }
  }

  private sortColorStops() {
    this.colorStops.sort((s1, s2) => s1.offset - s2.offset);
  }

  private editColor(element: SVGCircleElement) {
    const i = this.colorStopElements.findIndex(c => c === element);
    if (i >= 0) {
      this.colorService.pickColor(this.colorStops[i].color, '').subscribe({
        next: (value) => {
          this.colorStops[i].color = value;
          this.updateSvgColorStops();
          this.updateSvg();
        }
      });
    }
  }
}
