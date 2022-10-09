export interface ModelElement<B> {

	readonly id: string;

	buildSvg(builder: B): void;
}
