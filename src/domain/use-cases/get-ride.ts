import type UseCase from "../common/use-case";

export namespace GetRide {
	export type Params = {
		rideId: string;
	};

	export type Result = {
		rideId: string;
		passengerId: string;
		driverId: string;
		pickupLocation: {
			latitude: number;
			longitude: number;
		};
		dropoffLocation: {
			latitude: number;
			longitude: number;
		};
		status: string;
		requestDate: string;
		distance: number;
		fare: number;
	};

	export interface GetRide extends UseCase<Params, Result> {
		execute(params: Params): Promise<Result>;
	}
}
