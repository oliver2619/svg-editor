import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ContextMenuEntryComponent } from './context-menu-entry/context-menu-entry.component';
import { TextDirective } from './text/text.directive';
import { TitleDirective } from './text/title.directive';
import { TextPipe } from './text/text.pipe';
import { ActionDirective } from './action/action.directive';
import { MultiButtonComponent } from './multi-button/multi-button.component';
import { TabControlComponent } from './tab-control/tab-control.component';
import { TabComponent } from './tab-control/tab/tab.component';
import { ColorDialogComponent } from './color/color-dialog/color-dialog.component';
import { SliderInputComponent } from './slider-input/slider-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPatternDialogComponent } from './color/color-pattern-dialog/color-pattern-dialog.component';
import { ColorComponent } from './color/color/color.component';
import { LinearGradientComponent } from './color/linear-gradient/linear-gradient.component';
import { RadialGradientComponent } from './color/radial-gradient/radial-gradient.component';
import { PatternComponent } from './color/pattern/pattern.component';
import { PaletteComponent } from './color/palette/palette.component';
import { CanvasColorPickerDirective } from './color/canvas-color-picker.directive';
import { ShortcutDirective } from './shortcut/shortcut.directive';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ErrorMessageComponent } from './error/error-message/error-message.component';
import { ErrorStackComponent } from './error/error-stack/error-stack.component';
import { SvgEditorErrorHandler } from './error/error-handler';

@NgModule({
	declarations: [
		TextDirective,
		TitleDirective,
		DialogComponent,
		TextPipe,
		ContextMenuComponent,
		DropdownComponent,
		ContextMenuEntryComponent,
		ActionDirective,
		MultiButtonComponent,
		TabControlComponent,
		TabComponent,
		ColorDialogComponent,
		SliderInputComponent,
		ColorPatternDialogComponent,
		ColorComponent,
		LinearGradientComponent,
		RadialGradientComponent,
		PatternComponent,
		PaletteComponent,
		CanvasColorPickerDirective,
		ShortcutDirective,
		ImagePreviewComponent,
		ErrorMessageComponent,
		ErrorStackComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		TextDirective,
		TitleDirective,
		DialogComponent,
		TextPipe,
		ContextMenuComponent,
		DropdownComponent,
		ContextMenuEntryComponent,
		ActionDirective,
		MultiButtonComponent,
		TabControlComponent,
		TabComponent,
		ColorDialogComponent,
		SliderInputComponent,
		ColorPatternDialogComponent,
		ShortcutDirective,
		ImagePreviewComponent,
		ErrorStackComponent
	],
	providers: [{ provide: ErrorHandler, useClass: SvgEditorErrorHandler }]
})
export class SharedModule { }
