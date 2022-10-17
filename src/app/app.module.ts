import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ViewComponent } from './view/view.component';
import { ZoomComponent } from './view/zoom/zoom.component';
import { NewDocumentComponent } from './new-document/new-document.component';
import { ToolbarComponent } from './view/toolbar/toolbar.component';
import { MenuComponent } from './view/menu/menu.component';
import { SettingsComponent } from './settings/settings.component';
import { DocumentPropertiesComponent } from './document-properties/document-properties.component';
import { ImageResizeComponent } from './image-resize/image-resize.component';
import { DownloadComponent } from './download/download.component';
import { ImportSvgComponent } from './import-svg/import-svg.component';
import { GridsizeComponent } from './gridsize/gridsize.component';
import { SelectionPropertiesComponent } from './selection-properties/selection-properties.component';
import { ObjectTreeComponent } from './object-tree/object-tree.component';
import { ToolsComponent } from './tools/tools.component';
import { MiniviewComponent } from './miniview/miniview.component';
import { CropComponent } from './tools/crop/crop.component';
import { MoveComponent } from './tools/move/move.component';
import { RotateComponent } from './tools/rotate/rotate.component';
import { ScaleComponent } from './tools/scale/scale.component';
import { PencilComponent } from './tools/pencil/pencil.component';
import { PolygonComponent } from './tools/polygon/polygon.component';
import { TextComponent } from './tools/text/text.component';
import { ImageComponent } from './tools/image/image.component';
import { LibraryComponent } from './tools/library/library.component';
import { MeasureComponent } from './tools/measure/measure.component';
import { PathComponent } from './tools/path/path.component';
import { SelectComponent } from './tools/select/select.component';
import { ShapePropertiesComponent } from './shape-properties/shape-properties.component';
import { DashArrayDialogComponent } from './shape-properties/dash-array-dialog/dash-array-dialog.component';
import { RectComponent } from './tools/rect/rect.component';
import { ToolHelpComponent } from './view/tool-help/tool-help.component';
import { HelpAboutComponent } from './help/help-about/help-about.component';
import { HelpShortcutsComponent } from './help/help-shortcuts/help-shortcuts.component';
import { EditGeometryComponent } from './tools/edit-geometry/edit-geometry.component';
import { SelectedEllipsePropertiesComponent } from './selection-properties/selected-ellipse-properties/selected-ellipse-properties.component';
import { SelectedCirclePropertiesComponent } from './selection-properties/selected-circle-properties/selected-circle-properties.component';
import { SelectedImagePropertiesComponent } from './selection-properties/selected-image-properties/selected-image-properties.component';
import { SelectedRectPropertiesComponent } from './selection-properties/selected-rect-properties/selected-rect-properties.component';

@NgModule({
	declarations: [
		AppComponent,
		ViewComponent,
		ZoomComponent,
		NewDocumentComponent,
		ToolbarComponent,
		MenuComponent,
		SettingsComponent,
		DocumentPropertiesComponent,
		ImageResizeComponent,
		DownloadComponent,
		ImportSvgComponent,
		GridsizeComponent,
		SelectionPropertiesComponent,
		ObjectTreeComponent,
		ToolsComponent,
		MiniviewComponent,
		CropComponent,
		MoveComponent,
		RotateComponent,
		ScaleComponent,
		PencilComponent,
		PolygonComponent,
		TextComponent,
		ImageComponent,
		LibraryComponent,
		MeasureComponent,
		PathComponent,
		SelectComponent,
		ShapePropertiesComponent,
		DashArrayDialogComponent,
		RectComponent,
		ToolHelpComponent,
		HelpAboutComponent,
		HelpShortcutsComponent,
		EditGeometryComponent,
		SelectedEllipsePropertiesComponent,
		SelectedCirclePropertiesComponent,
		SelectedImagePropertiesComponent,
		SelectedRectPropertiesComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
