import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef } from '@angular/core';
import { AbstractClickTool } from '../tool';
import { ViewService, ViewSelectMode } from 'src/app/view/view.service';
import { ToolMouseEvent } from '../tool-mouse-event';
import { TextService } from 'src/app/shared/text/text.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class SelectTool extends AbstractClickTool {

	private component: SelectComponent | undefined;

	constructor(private readonly viewService: ViewService) {
		super();
	}

	cleanUp() { }

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(SelectComponent);
		this.component = ret.instance;
		return ret;
	}

	getHint(textService: TextService): string {
		return textService.get('tool.select.hint');
	}

	mouseDown(e: ToolMouseEvent): boolean {
		const selectAll = this.component !== undefined ? this.component.selectAll : false;
		const selectGroups = this.component !== undefined ? this.component.selectGroups : false;
		if (e.shiftKey && !e.ctrlKey) {
			this.viewService.selectByPoint(e.x, e.y, ViewSelectMode.ADD, selectAll, selectGroups);
		} else if (e.ctrlKey && !e.shiftKey) {
			this.viewService.selectByPoint(e.x, e.y, ViewSelectMode.REMOVE, selectAll, selectGroups);
		} else if (!e.ctrlKey && !e.shiftKey) {
			this.viewService.selectByPoint(e.x, e.y, ViewSelectMode.REPLACE, selectAll, selectGroups);
		}
		return false;
	}
}

interface SelectComponentValue {
	mode: string;
	groups: boolean;
}

@Component({
	selector: 'se-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent {

	readonly formGroup: FormGroup;

	get selectAll(): boolean {
		return this.value.mode === 'all';
	}

	get selectGroups(): boolean {
		return this.value.groups;
	}

	private get value(): SelectComponentValue {
		return this.formGroup.value;
	}

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('mode', formBuilder.control('all', [Validators.required]));
		this.formGroup.addControl('groups', formBuilder.control(true));
	}
}
