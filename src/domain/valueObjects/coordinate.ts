import ValueObject from "../common/value-object";

type CoordinateProps = {
	latitude: number;
	longitude: number;
};

export class Coordinate extends ValueObject<CoordinateProps> {
	constructor(props: CoordinateProps) {
		if (props.latitude < -90 || props.latitude > 90) throw new Error("Invalid latitude");
		if (props.longitude < -180 || props.longitude > 180) throw new Error("Invalid longitude");
		super(props);
	}

	get latitude(): number {
		return this._props.latitude;
	}

	get longitude(): number {
		return this._props.longitude;
	}
}
