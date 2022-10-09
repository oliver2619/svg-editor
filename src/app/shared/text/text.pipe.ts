import { Pipe, PipeTransform } from '@angular/core';
import { TextService } from './text.service';

@Pipe({
	name: 'text'
})
export class TextPipe implements PipeTransform {

	constructor(private readonly textService: TextService) { }

	transform(value: unknown, ...args: unknown[]): unknown {
		return this.textService.get(String(value), [...args]);
	}

}
