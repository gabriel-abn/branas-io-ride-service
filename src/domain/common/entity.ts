export default abstract class Entity<T> {
	protected readonly _id: string;
	protected readonly _props: T;

	constructor(props: T, id?: string) {
		this._id = id || crypto.randomUUID().split("-", 2).join("");
		this._props = props;
	}

	get id(): string {
		return this._id;
	}
}
