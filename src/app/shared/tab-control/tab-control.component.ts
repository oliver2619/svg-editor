import { ChangeDetectionStrategy, Component, QueryList, ContentChildren, AfterViewInit } from '@angular/core';
import { TabComponent, Tab } from './tab/tab.component';

@Component({
	selector: 'se-tab-control',
	templateUrl: './tab-control.component.html',
	styleUrls: ['./tab-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabControlComponent implements AfterViewInit {

	@ContentChildren(TabComponent)
	tabComponents: QueryList<TabComponent> | undefined;

	active = 0;

	get tabs(): Tab[] {
		if (this.tabComponents !== undefined) {
			return this.tabComponents.map(t => t as Tab);
		} else {
			return [];
		}
	}

	constructor() { }

	ngAfterViewInit(): void {
		if (this.tabComponents !== undefined) {
			if (this.tabComponents.length > 0) {
				this.active = 0;
				this.activeChange();
			}
		}
	}

	select(i: number) {
		this.active = i;
		this.activeChange();
	}

	private activeChange() {
		if (this.tabComponents !== undefined) {
			this.tabComponents.forEach((t, i) => t.visible = this.active === i);
		}
	}
}
