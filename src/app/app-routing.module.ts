import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewDocumentComponent } from './new-document/new-document.component';
import { SettingsComponent } from './settings/settings.component';
import { DocumentPropertiesComponent } from './document-properties/document-properties.component';
import { ImageResizeComponent } from './image-resize/image-resize.component';
import { DownloadComponent } from './download/download.component';
import { ImportSvgComponent } from './import-svg/import-svg.component';
import { GridsizeComponent } from './gridsize/gridsize.component';
import { HelpAboutComponent } from './help/help-about/help-about.component';
import { HelpShortcutsComponent } from './help/help-shortcuts/help-shortcuts.component';

const routes: Routes = [ {
	path: 'documentProperties',
	pathMatch: 'full',
	component: DocumentPropertiesComponent
}, {
	path: 'download',
	pathMatch: 'full',
	component: DownloadComponent
}, {
	path: 'gridsize',
	pathMatch: 'full',
	component: GridsizeComponent
}, {
	path: 'help/about',
	pathMatch: 'full',
	component: HelpAboutComponent
}, {
	path: 'help/shortcuts',
	pathMatch: 'full',
	component: HelpShortcutsComponent
}, {
	path: 'imageAdjustSize',
	pathMatch: 'full',
	component: ImageResizeComponent
}, {
	path: 'importSvg',
	pathMatch: 'full',
	component: ImportSvgComponent
}, {
	path: 'newDocument',
	pathMatch: 'full',
	component: NewDocumentComponent
}, {
	path: 'settings',
	pathMatch: 'full',
	component: SettingsComponent
}];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
