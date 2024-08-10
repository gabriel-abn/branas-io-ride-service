import Entity from "../common/entity";
import { Coordinate } from "../valueObjects/coordinate";

type RideProps = {
	rideId: string;
	passengerId: string;
	driverId: string;
	pickupLocation: Coordinate;
	dropoffLocation: Coordinate;
	status: "REQUESTED" | "ACCEPTED" | "ARRIVED" | "ON_GOING" | "COMPLETED";
	requestDate: Date;
	distance: number;
	fare: number;
};

export class Ride extends Entity<RideProps> {
	private constructor(props: RideProps) {
		super(props, props.rideId);
	}

	public static create(
		passengerId: string,
		from: { lat: number; long: number },
		to: { lat: number; long: number },
	): Ride {
		return new Ride({
			passengerId,
			pickupLocation: new Coordinate({ latitude: from.lat, longitude: from.long }),
			dropoffLocation: new Coordinate({ latitude: to.lat, longitude: to.long }),
			rideId: `RIDE${crypto.randomUUID().split("-", 2).join("")}`,
			driverId: "",
			status: "REQUESTED",
			requestDate: new Date(),
			distance: 0,
			fare: 0,
		});
	}

	static restore(props: RideProps): Ride {
		return new Ride(props);
	}

	get passengerId(): string {
		return this._props.passengerId;
	}

	get pickupLocation(): Coordinate {
		return this._props.pickupLocation;
	}

	get dropoffLocation(): Coordinate {
		return this._props.dropoffLocation;
	}

	get status() {
		return this._props.status;
	}

	set status(status: "REQUESTED" | "ACCEPTED" | "ARRIVED" | "ON_GOING" | "COMPLETED") {
		this._props.status = status;
	}

	get fare() {
		return this._props.fare;
	}

	set fare(fare: number) {
		this._props.fare = fare;
	}

	get distance() {
		return this._props.distance;
	}

	set distance(distance: number) {
		this._props.distance = distance;
	}

	get requestDate() {
		return this._props.requestDate;
	}

	get driverId() {
		return this._props.driverId;
	}
}
