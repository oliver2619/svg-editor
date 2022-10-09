import { PathElementsBuilder } from '../svg-builder/path-builder';
import { PathCmdProperties, PathCmdMoveProperties, PathCmdHLineProperties, PathCmdVLineProperties, PathCmdLineToProperties, PathCmdCloseProperties, PathCmdBezierCurveToProperties, PathCmdContinueBezierCurveToProperties, PathCmdQuadCurveToProperties, PathCmdContinueQuadCurveToProperties } from '../path-properties';

export abstract class PathCmdModelImp {

	abstract buildPathElement(builder: PathElementsBuilder): void;

	static create(properties: PathCmdProperties): PathCmdModelImp {
		switch (properties.cmd) {
			case 'M':
				return new PathCmdMoveToModelImp(properties as PathCmdMoveProperties);
			case 'H':
				return new PathCmdHLineToModelImp(properties as PathCmdHLineProperties);
			case 'V':
				return new PathCmdVLineToModelImp(properties as PathCmdVLineProperties);
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

	abstract getMnemento(): PathCmdProperties;

	abstract translate(dx: number, dy: number): void;
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

	translate(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
	}
}

class PathCmdHLineToModelImp extends PathCmdModelImp {

	private x: number;

	constructor(props: PathCmdHLineProperties) {
		super();
		this.x = props.x;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.horizontalLineTo(this.x); }

	getMnemento(): PathCmdHLineProperties {
		return {
			cmd: 'H',
			x: this.x
		}
	}

	translate(dx: number, dy: number) {
		this.x += dx;
	}
}

class PathCmdVLineToModelImp extends PathCmdModelImp {

	private y: number;

	constructor(props: PathCmdVLineProperties) {
		super();
		this.y = props.y;
	}

	buildPathElement(builder: PathElementsBuilder) { builder.verticalLineTo(this.y); }

	getMnemento(): PathCmdVLineProperties {
		return {
			cmd: 'V',
			y: this.y
		}
	}

	translate(dx: number, dy: number) {
		this.y += dy;
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

	translate(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
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

	translate(dx: number, dy: number) {
		this.hx1 += dx;
		this.hy1 += dy;
		this.hx2 += dx;
		this.hy2 += dy;
		this.x += dx;
		this.y += dy;
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

	translate(dx: number, dy: number) {
		this.hx += dx;
		this.hy += dy;
		this.x += dx;
		this.y += dy;
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

	translate(dx: number, dy: number) {
		this.hx += dx;
		this.hy += dy;
		this.x += dx;
		this.y += dy;
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

	translate(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
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

	translate(dx: number, dy: number) { }
}

