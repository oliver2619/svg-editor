import { Tool } from 'src/app/tools/tool';
import { SimpleAction } from './simple-action';
import { ToolService, Tools } from 'src/app/tools/tool.service';

export interface ToolData {
	tool: Tool;
	group: string;
	name: string;
	icon: string;
	shortcutKey?: string;
	shortcutModifiers?: number;
}

export class ToolAction extends SimpleAction<ToolService> {

	constructor(toolService: ToolService, data: ToolData) {
		super(toolService, {
			group: data.group,
			name: data.name,
			icon: data.icon,
			shortcutKey: data.shortcutKey,
			shortcutModifiers: data.shortcutModifiers,
			action: (ts: ToolService) => ts.current = data.tool,
			active: (ts: ToolService) => ts.current === data.tool
		});
		toolService.onToolChange.subscribe({
			next: (tools: Tools) => {
				this.update();
			}
		});
		this.update();
	}
}
