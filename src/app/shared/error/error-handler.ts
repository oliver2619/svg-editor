import { ErrorHandler, Injectable } from "@angular/core";
import { TextService } from "../text/text.service";
import { ErrorService } from "./error.service";

@Injectable({
	providedIn: 'root'
})
export class SvgEditorErrorHandler implements ErrorHandler {

	constructor(private readonly errorService: ErrorService, private readonly textService: TextService) { }

	handleError(error: any): void {
		console.error(error);
		this.errorService.showError(this.textService.get('errorHandler.defaultMessage'));
	}
}