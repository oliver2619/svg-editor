export class Coordinate {

	constructor(public x: number, public y: number) { }

	clone(): Coordinate { return new Coordinate(this.x, this.y); }

	flipH(px: number) { this.x = px * 2 - this.x; }

	flipV(py: number) { this.y = py * 2 - this.y; }

	rotate(deg: number, px: number, py: number) {
		const dx = this.x - px;
		const dy = this.y - py;
		const a = deg * Math.PI / 180;
		const cs = Math.cos(a);
		const sn = Math.sin(a);
		const nx = dx * cs - dy * sn;
		const ny = dx * sn + dy * cs;
		this.x = px + nx;
		this.y = py + ny;
	}

	scale(sx: number, sy: number, px: number, py: number) {
		this.x = (this.x - px) * sx + px;
		this.y = (this.y - py) * sy + py;
	}

	translate(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
	}
}