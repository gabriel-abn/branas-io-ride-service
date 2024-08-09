import type UseCase from "../common/use-case";

export namespace RequestRide {
	export type Params = {
		passangerId: string;
		from: {
			latitute: number;
			longitude: number;
		};
		to: {
			latitute: number;
			longitude: number;
		};
	};

	export type Result = {
		rideId: string;
	};

	export interface RequestRide extends UseCase<Params, Result> {
		execute(params: Params): Promise<Result>;
	}
}
