import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../../../package.json';

@Component({
	selector: 'se-help-about',
	templateUrl: './help-about.component.html',
	styleUrls: ['./help-about.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpAboutComponent {

	get version(): string {
		return packageJson.version;
	}
	
	constructor(private readonly router: Router) { }

	close() {
		this.router.navigateByUrl('/');
	}
}
