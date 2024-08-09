export default abstract class ValueObject<T> {
	protected readonly _props: T;

	constructor(props: T) {
		this._props = props;
	}

	get value(): T {
		return this._props;
	}

	equals(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		if (vo.value === undefined) {
			return false;
		}

		return JSON.stringify(this.value) === JSON.stringify(vo.value);
	}
}
