import { PathElementsBuilder } from '../svg-builder/path-builder';
import { PathCmdProperties, PathCmdMoveProperties, PathCmdLineToProperties, PathCmdCloseProperties, PathCmdBezierCurveToProperties, PathCmdContinueBezierCurveToProperties, PathCmdQuadCurveToProperties, PathCmdContinueQuadCurveToProperties } from '../path-properties';
import { Coordinate } from '../coordinate';

export abstract class PathCmdModelImp {

	abstract buildPathElement(builder: PathElementsBuilder): void;

	static create(properties: PathCmdProperties): PathCmdModelImp {
		switch (properties.cmd) {
			case 'M':
				return new PathCmdMoveToModelImp(properties as PathCmdMoveProperties);
			case 'L':
				return new PathCmdLineToModelImp(properties as PathCmdLineToProperties);
			case 'C':
				return new PathCmdBezierCurveToModelImp(properties as PathCmdBezierCurveToProperties);
			case 'S':
				return new PathCmdContinueCurveToModelImp(properties as PathCmdContinueBezierCurveToProperties);
			case 'Q':
				return new PathCmdQuadCurveToModelImp(properties as PathCmdQuadCurveToProperties);
			case 'T':
				return new PathCmdContinueQuadCurveToModelImp(properties as PathCmdContinueQuadCurveToProperties);
			case 'Z':
				return new PathCmdCloseModelImp(properties as PathCmdCloseProperties);
			default:
				throw new RangeError(`Path command ${properties.cmd} not supported`);
		}
	}

	flipH(px: number) { this.processVertices(c => c.flipH(px)); }

	flipV(py: number) { this.processVertices(c => c.flipV(py)); }

	abstract getMnemento(): PathCmdProperties;

	rotate(deg: number, px: number, py: number) { this.processVertices(c => c.rotate(deg, px, py)); }

	scale(sx: number, sy: number, px: number, py: number): void { this.processVertices(c => c.scale(sx, sy, px, py)); }

	translate(dx: number, dy: number) { this.processVertices(c => c.translate(dx, dy)); }

	protected abstract processVertices(f: (c: Coordinate) => any): void;
}

class PathCmdMoveToModelImp extends PathCmdModelImp {

	private x: number;
	private y: number;

	constructor(props: PathCmdMoveProperties) {
		super();
		this.x = props.x;
		this.y = props.y;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.moveTo(this.x, this.y); }

	getMnemento(): PathCmdMoveProperties {
		return {
			cmd: 'M',
			x: this.x,
			y: this.y
		}
	}

	protected processVertices(f: (c: Coordinate) => any): void {
		const c = new Coordinate(this.x, this.y);
		f(c);
		this.x = c.x;
		this.y = c.y;
	}
}

class PathCmdLineToModelImp extends PathCmdModelImp {

	private x: number;
	private y: number;

	constructor(props: PathCmdLineToProperties) {
		super();
		this.x = props.x;
		this.y = props.y;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.lineTo(this.x, this.y); }

	getMnemento(): PathCmdLineToProperties {
		return {
			cmd: 'L',
			x: this.x,
			y: this.y
		}
	}

	protected processVertices(f: (c: Coordinate) => any): void {
		const c = new Coordinate(this.x, this.y);
		f(c);
		this.x = c.x;
		this.y = c.y;
	}
}

class PathCmdBezierCurveToModelImp extends PathCmdModelImp {

	private hx1: number;
	private hy1: number;
	private hx2: number;
	private hy2: number;
	private x: number;
	private y: number;

	constructor(props: PathCmdBezierCurveToProperties) {
		super();
		this.hx1 = props.hx1;
		this.hy1 = props.hy1;
		this.hx2 = props.hx2;
		this.hy2 = props.hy2;
		this.x = props.x;
		this.y = props.y;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.bezierCurveTo(this.hx1, this.hy1, this.hx2, this.hy2, this.x, this.y); }

	getMnemento(): PathCmdBezierCurveToProperties {
		return {
			cmd: 'C',
			hx1: this.hx1,
			hy1: this.hy1,
			hx2: this.hx2,
			hy2: this.hy2,
			x: this.x,
			y: this.y
		}
	}

	protected processVertices(f: (c: Coordinate) => any): void {
		let c = new Coordinate(this.hx1, this.hy1);
		f(c);
		this.hx1 = c.x;
		this.hy1 = c.y;
		c = new Coordinate(this.hx2, this.hy2);
		f(c);
		this.hx2 = c.x;
		this.hy2 = c.y;
		c = new Coordinate(this.x, this.y);
		f(c);
		this.x = c.x;
		this.y = c.y;
	}
}

class PathCmdContinueCurveToModelImp extends PathCmdModelImp {

	private hx: number;
	private hy: number;
	private x: number;
	private y: number;

	constructor(props: PathCmdContinueBezierCurveToProperties) {
		super();
		this.hx = props.hx;
		this.hy = props.hy;
		this.x = props.x;
		this.y = props.y;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.continueBezierCurveTo(this.hx, this.hy, this.x, this.y); }

	getMnemento(): PathCmdContinueBezierCurveToProperties {
		return {
			cmd: 'S',
			hx: this.hx,
			hy: this.hy,
			x: this.x,
			y: this.y
		}
	}

	protected processVertices(f: (c: Coordinate) => any): void {
		let c = new Coordinate(this.hx, this.hy);
		f(c);
		this.hx = c.x;
		this.hy = c.y;
		c = new Coordinate(this.x, this.y);
		f(c);
		this.x = c.x;
		this.y = c.y;
	}
}

class PathCmdQuadCurveToModelImp extends PathCmdModelImp {

	private hx: number;
	private hy: number;
	private x: number;
	private y: number;

	constructor(props: PathCmdQuadCurveToProperties) {
		super();
		this.hx = props.hx;
		this.hy = props.hy;
		this.x = props.x;
		this.y = props.y;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.quadraticCurveTo(this.hx, this.hy, this.x, this.y); }

	getMnemento(): PathCmdQuadCurveToProperties {
		return {
			cmd: 'Q',
			hx: this.hx,
			hy: this.hy,
			x: this.x,
			y: this.y
		}
	}

	protected processVertices(f: (c: Coordinate) => any): void {
		let c = new Coordinate(this.hx, this.hy);
		f(c);
		this.hx = c.x;
		this.hy = c.y;
		c = new Coordinate(this.x, this.y);
		f(c);
		this.x = c.x;
		this.y = c.y;
	}
}

class PathCmdContinueQuadCurveToModelImp extends PathCmdModelImp {

	private x: number;
	private y: number;

	constructor(props: PathCmdContinueQuadCurveToProperties) {
		super();
		this.x = props.x;
		this.y = props.y;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.continueQuadraticCurveTo(this.x, this.y); }

	getMnemento(): PathCmdContinueQuadCurveToProperties {
		return {
			cmd: 'T',
			x: this.x,
			y: this.y
		}
	}

	protected processVertices(f: (c: Coordinate) => any): void {
		const c = new Coordinate(this.x, this.y);
		f(c);
		this.x = c.x;
		this.y = c.y;
	}
}

class PathCmdCloseModelImp extends PathCmdModelImp {

	constructor(props: PathCmdCloseProperties) {
		super();
	}

	buildPathElement(builder: PathElementsBuilder) { builder.closePath(); }

	getMnemento(): PathCmdCloseProperties {
		return {
			cmd: 'Z'
		}
	}

	protected processVertices(f: (c: Coordinate) => any): void { }
}

