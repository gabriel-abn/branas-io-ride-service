import type { IRideRepository } from "src/application/protocols/repositories";
import { Ride } from "src/domain/entities/ride";
import type { RequestRide } from "src/domain/use-cases";
import ApplicationError from "../common/application-error";

export default class RequestRideUseCase implements RequestRide.RequestRide {
	constructor(private readonly rideRepository: IRideRepository) {}

	async execute(params: RequestRide.Params): Promise<RequestRide.Result> {
		const exists = await this.rideRepository.get({ passengerId: params.passangerId });

		if (exists.length > 0) {
			const ride = exists.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime()).toReversed()[0];
			if (["REQUESTED", "ACCEPTED", "ON_GOING", "ARRIVED"].includes(ride.status)) {
				throw new ApplicationError("There is already a ride requested.", "REQUESTED_RIDE_ALREADY_EXISTS");
			}
		}

		const ride = Ride.create(
			params.passangerId,
			{ lat: params.from.latitute, long: params.from.longitude },
			{ lat: params.to.latitute, long: params.to.longitude },
		);

		await this.rideRepository.save(ride);

		return {
			rideId: ride.id,
		};
	}
}
