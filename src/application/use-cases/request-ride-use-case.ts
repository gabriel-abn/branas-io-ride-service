import type { IRideRepository } from "src/application/protocols/repositories";
import { Ride } from "src/domain/entities/ride";
import type { RequestRide } from "src/domain/use-cases";

export default class RequestRideUseCase implements RequestRide.RequestRide {
	constructor(private readonly rideRepository: IRideRepository) {}

	async execute(params: RequestRide.Params): Promise<RequestRide.Result> {
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
