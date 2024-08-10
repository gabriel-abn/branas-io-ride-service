import type { GetRide } from "src/domain/use-cases";
import ApplicationError from "../common/application-error";
import type { IRideRepository } from "../protocols/repositories";

export default class GetRideUseCase implements GetRide.GetRide {
	constructor(private readonly rideRepository: IRideRepository) {}

	async execute(params: GetRide.Params): Promise<GetRide.Result> {
		const [ride] = await this.rideRepository.get({ rideId: params.rideId });

		if (!ride) {
			throw new ApplicationError("Ride not found", "RIDE_NOT_FOUND");
		}

		return {
			rideId: ride.id,
			passengerId: ride.passengerId,
			driverId: ride.driverId,
			distance: ride.distance,
			status: ride.status,
			fare: ride.fare,
			requestDate: ride.requestDate.toDateString(),
			dropoffLocation: ride.dropoffLocation.value,
			pickupLocation: ride.pickupLocation.value,
		};
	}
}
