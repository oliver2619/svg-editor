import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ModalService } from '../modal.service';
import { ColorDialogComponent } from './color-dialog/color-dialog.component';
import { ColorPatternDialogComponent } from './color-pattern-dialog/color-pattern-dialog.component';
import { Color } from 'src/app/model/color/color';
import { SingleColor } from 'src/app/model/color/single-color';

@Injectable({
	providedIn: 'root'
})
export class ColorService {

	constructor(private readonly modalService: ModalService) { }

	pickColor(color: SingleColor, title: string): Observable<SingleColor> {
		return this.modalService.showDialog(ColorDialogComponent, color, title);
	}

	pickColorPattern(color: Color, title: string): Observable<Color> {
		return this.modalService.showDialog(ColorPatternDialogComponent, color, title);
	}

}
