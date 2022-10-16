import { PathCmdBezierCurveToProperties, PathCmdCloseProperties, PathCmdContinueBezierCurveToProperties, PathCmdContinueQuadCurveToProperties, PathCmdLineToProperties, PathCmdMoveProperties, PathCmdProperties, PathCmdQuadCurveToProperties } from "./path-properties";

export class PathPropertiesBuilder {

    private readonly properties: PathCmdProperties[] = [];

    bezierCurveTo(hx1: number, hy1: number, hx2: number, hy2: number, x: number, y: number): PathPropertiesBuilder {
        const cmd: PathCmdBezierCurveToProperties = {
            cmd: 'C',
            hx1, hy1, hx2, hy2, x, y
        };
        this.properties.push(cmd);
        return this;
    }

    clear(): PathPropertiesBuilder {
        this.properties.splice(0, this.properties.length);
        return this;
    }

    close(): PathPropertiesBuilder {
        const cmd: PathCmdCloseProperties = {
            cmd: 'Z'
        };
        this.properties.push(cmd);
        return this;
    }

    continueBezierCurveTo(hx: number, hy: number, x: number, y: number): PathPropertiesBuilder {
        const cmd: PathCmdContinueBezierCurveToProperties = {
            cmd: 'S',
            hx,
            hy,
            x,
            y
        };
        this.properties.push(cmd);
        return this;
    }

    continueQuadraticCurveTo(x: number, y: number): PathPropertiesBuilder {
        const cmd: PathCmdContinueQuadCurveToProperties = {
            cmd: 'T',
            x,
            y
        };
        this.properties.push(cmd);
        return this;
    }

    getCommands(): PathCmdProperties[] {
        return this.properties.slice(0);
    }

    moveTo(x: number, y: number): PathPropertiesBuilder {
        const cmd: PathCmdMoveProperties = {
            cmd: 'M',
            x,
            y
        };
        this.properties.push(cmd);
        return this;
    }

    lineTo(x: number, y: number): PathPropertiesBuilder {
        const cmd: PathCmdLineToProperties = {
            cmd: 'L',
            x,
            y
        };
        this.properties.push(cmd);
        return this;
    }

    quadraticCurveTo(hx: number, hy: number, x: number, y: number): PathPropertiesBuilder {
        const cmd: PathCmdQuadCurveToProperties = {
            cmd: 'Q',
            hx,
            hy,
            x,
            y
        };
        this.properties.push(cmd);
        return this;
    }
}