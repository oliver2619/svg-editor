export class Utils {

	static deepCopy<T>(input: T): T {
		if (typeof input === 'object') {
			if (input instanceof Array) {
				return input.map(v => Utils.deepCopy(v)) as any as T;
			} else {
				const ret: any = {};
				Object.entries(input).forEach(e => ret[e[0]] = Utils.deepCopy(e[1]));
				return ret;
			}
		} else {
			return input;
		}
	}
}