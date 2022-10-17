import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, AfterViewInit, OnInit, Output, EventEmitter } from '@angular/core';
import { Action } from '../shared/action/action';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextService } from '../shared/text/text.service';
import { SettingsService } from '../settings/settings.service';
import { ColorService } from '../shared/color/color.service';
import { ModalService } from '../shared/modal.service';
import { DashArrayDialogComponent } from './dash-array-dialog/dash-array-dialog.component';
import { LinePattern, LineCap, LineJoin } from '../model/line-properties';
import { Color } from '../model/color/color';
import { VectorEffect } from '../model/vector-effect';
import { SimpleAction } from '../shared/action/simple-action';
import { FilledElementBuilderImp } from '../model/svg-builder/filled-element-builder';
import { StrokedElementBuilderImp } from '../model/svg-builder/stroked-element-builder';
import { FillProperties, ShapeProperties, StrokeProperties } from '../model/properties/model-element-properties';
import { ColorFactory } from '../model/color/color-factory';
import { ContextColor } from '../model/color/context-color';
import { ShapePropertiesComponentInterface } from './shape-properties-component-interface';

export interface ShapePropertiesComponentValue {
	opacity: number;
	vectorEffect: VectorEffect;
	lineCap: LineCap;
	lineJoin: LineJoin;
	stroke: Color;
	strokeWidth: number;
	fill: Color;
	dashArray: number[];
}

class LineCapAction extends SimpleAction<ShapePropertiesComponent> {
	constructor(context: ShapePropertiesComponent, value: LineCap, name: string, icon: string) {
		super(context, {
			action: (c: ShapePropertiesComponent) => { c.lineCap = value; },
			active: (c: ShapePropertiesComponent) => { return c.lineCap === value; },
			name,
			icon
		});
	}
}

class LineJoinAction extends SimpleAction<ShapePropertiesComponent>{

	constructor(context: ShapePropertiesComponent, value: LineJoin, name: string, icon: string) {
		super(context, {
			action: (c: ShapePropertiesComponent) => { c.lineJoin = value; },
			active: (c: ShapePropertiesComponent) => { return c.lineJoin === value; },
			name,
			icon
		});
	}
}

@Component({
	selector: 'se-shape-properties',
	templateUrl: './shape-properties.component.html',
	styleUrls: ['./shape-properties.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShapePropertiesComponent implements AfterViewInit, OnInit, ShapePropertiesComponentInterface {

	@Input('fill')
	enableFill: boolean = true;

	@Input('line-join')
	enableLineJoin = true;

	@Input('global')
	global = false;

	@ViewChild('fillColor')
	fillColorElement: ElementRef<SVGRectElement> | undefined

	@ViewChild('strokeColor')
	strokeColorElement: ElementRef<SVGRectElement> | undefined

	@ViewChild('dashArray')
	dashArrayElement: ElementRef<SVGLineElement> | undefined

	@Output('fill-change')
	onFillChange = new EventEmitter<FillProperties>();

	@Output('stroke-change')
	onStrokeChange = new EventEmitter<StrokeProperties>();

	@Output('shape-change')
	onShapeChange = new EventEmitter<ShapeProperties>();

	@Output('line-join-change')
	onLineJoinChange = new EventEmitter<LineJoin>();

	readonly actionJoinArcs: Action;
	readonly actionJoinBevel: Action;
	readonly actionJoinRound: Action;
	readonly actionCapButt: Action;
	readonly actionCapSquare: Action;
	readonly actionCapRound: Action;

	formGroup: FormGroup;

	get fillProperties(): FillProperties {
		const v = this.value;
		return {
			color: v.fill
		};
	}

	set fillProperties(p: FillProperties) {
		const v = this.value;
		v.fill = p.color;
		this.value = v;
		this.updateSvgs();
	}

	get shapeProperties(): ShapeProperties {
		const v = this.value;
		return {
			opacity: v.opacity / 100,
			vectorEffect: v.vectorEffect
		}
	}

	set shapeProperties(p: ShapeProperties) {
		const v = this.value;
		v.opacity = p.opacity * 100;
		v.vectorEffect = p.vectorEffect;
		this.value = v;
	}

	get strokeProperties(): StrokeProperties {
		const v = this.value;
		return {
			color: v.stroke,
			linePattern: new LinePattern(v.dashArray, v.strokeWidth),
			lineCap: v.lineCap
		};
	}

	set strokeProperties(p: StrokeProperties) {
		const v = this.value;
		v.stroke = p.color;
		v.dashArray = p.linePattern.array.slice(0);
		v.strokeWidth = p.linePattern.width;
		v.lineCap = p.lineCap;
		this.value = v;
		this.updateSvgs();
	}

	get lineCap(): LineCap {
		return this.value.lineCap;
	}

	set lineCap(c: LineCap) {
		const v = {...this.value};
		v.lineCap = c;
		this.value = v;
		this.onStrokeChange.emit(this.strokeProperties);
	}

	get lineJoin(): LineJoin {
		return this.value.lineJoin;
	}

	set lineJoin(j: LineJoin) {
		const v = {...this.value};
		v.lineJoin = j;
		this.value = v;
		this.onLineJoinChange.emit(j);
	}

	private get value(): ShapePropertiesComponentValue {
		return this.formGroup.value;
	}

	private set value(v: ShapePropertiesComponentValue) {
		this.formGroup.setValue(v);
	}

	constructor(private readonly settingsService: SettingsService, private readonly colorService: ColorService, private readonly textService: TextService, private readonly modalService: ModalService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('opacity', formBuilder.control(100, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('strokeWidth', formBuilder.control(1, [Validators.required, Validators.min(0)]));
		this.formGroup.addControl('vectorEffect', formBuilder.control('none', [Validators.required]));
		this.formGroup.addControl('lineCap', formBuilder.control('butt', [Validators.required]));
		this.formGroup.addControl('lineJoin', formBuilder.control('arcs', [Validators.required]));
		this.formGroup.addControl('stroke', formBuilder.control(ContextColor.INSTANCE, [Validators.required]));
		this.formGroup.addControl('fill', formBuilder.control(ContextColor.INSTANCE, [Validators.required]));
		this.formGroup.addControl('dashArray', formBuilder.control([]));
		this.actionJoinArcs = new LineJoinAction(this, 'arcs', this.textService.get('lineJoin.arcs'), 'icons/linejoin_arcs.svg');
		this.actionJoinBevel = new LineJoinAction(this, 'bevel', this.textService.get('lineJoin.bevel'), 'icons/linejoin_bevel.svg');
		this.actionJoinRound = new LineJoinAction(this, 'round', this.textService.get('lineJoin.round'), 'icons/linejoin_round.svg');
		this.actionCapButt = new LineCapAction(this, 'butt', this.textService.get('lineCap.butt'), 'icons/linecap_butt.svg');
		this.actionCapSquare = new LineCapAction(this, 'square', this.textService.get('lineCap.square'), 'icons/linecap_square.svg');
		this.actionCapRound = new LineCapAction(this, 'round', this.textService.get('lineCap.round'), 'icons/linecap_round.svg');
	}

	ngOnInit() {
		if (this.global) {
			const json = this.settingsService.currentShape;
			const value = this.value;
			value.dashArray = json.dashArray;
			value.fill = ColorFactory.fromJson(json.fill);
			value.lineCap = json.lineCap;
			value.lineJoin = json.lineJoin;
			value.opacity = json.opacity * 100;
			value.stroke = ColorFactory.fromJson(json.stroke);
			value.strokeWidth = json.strokeWidth;
			value.vectorEffect = json.vectorEffect;
			this.formGroup.setValue(value, { emitEvent: false });
			this.formGroup.valueChanges.subscribe({
				next: (v: ShapePropertiesComponentValue) => {
					this.settingsService.merge(json => {
						const shape = json.tools.currentShape;
						shape.dashArray = v.dashArray;
						shape.fill = v.fill.toJson();
						shape.lineCap = v.lineCap;
						shape.lineJoin = v.lineJoin;
						shape.opacity = v.opacity / 100;
						shape.stroke = v.stroke.toJson();
						shape.strokeWidth = v.strokeWidth;
						shape.vectorEffect = v.vectorEffect;
					});
				}
			});
		}
	}

	ngAfterViewInit(): void {
		this.updateSvgs();
	}

	selectFillColor() {
		const v = this.value;
		this.colorService.pickColorPattern(v.fill, this.textService.get('shape.fillColor')).subscribe({
			next: (value: Color) => {
				v.fill = value;
				this.value = v;
				this.updateSvgs();
				this.onFillChange.emit(this.fillProperties);
			}
		});
	}

	selectStrokeColor() {
		const v = this.value;
		this.colorService.pickColorPattern(v.stroke, this.textService.get('shape.strokeColor')).subscribe({
			next: (value: Color) => {
				v.stroke = value;
				this.value = v;
				this.updateSvgs();
				this.onStrokeChange.emit(this.strokeProperties);
			}
		});
	}

	selectDashArray() {
		const v = this.value;
		this.modalService.showDialog(DashArrayDialogComponent, new LinePattern(v.dashArray, v.strokeWidth), this.textService.get('dashPattern')).subscribe({
			next: (value: LinePattern) => {
				v.dashArray = value.array;
				v.strokeWidth = value.width;
				this.value = v;
				this.updateSvgs();
				this.onStrokeChange.emit(this.strokeProperties);
			}
		});
	}

	onChangeLineWidth() {
		this.onStrokeChange.emit(this.strokeProperties);
	}

	onChangeOpacity() {
		this.onShapeChange.emit(this.shapeProperties);
	}

	onChangeVectorEffect() {
		this.onShapeChange.emit(this.shapeProperties);
	}

	private updateSvgs() {
		if (this.fillColorElement !== undefined) {
			this.value.fill.buildFillAttributes(new FilledElementBuilderImp(this.fillColorElement.nativeElement));
		}
		if (this.strokeColorElement !== undefined) {
			this.value.stroke.buildStrokeAttributes(new StrokedElementBuilderImp(this.strokeColorElement.nativeElement));
		}
		if (this.dashArrayElement !== undefined) {
			const array = this.value.dashArray;
			if (array.length > 0) {
				this.dashArrayElement.nativeElement.setAttribute('stroke-dasharray', array.map(it => it * 4).join(','));
			} else {
				this.dashArrayElement.nativeElement.removeAttribute('stroke-dasharray');
			}
		}
	}
}
