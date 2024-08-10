import type { GetRide } from "src/domain/use-cases";
import Controller from "../common/controller";
import type { HttpRequest } from "../common/http";

export default class GetRideController extends Controller<null> {
	constructor(private readonly useCase: GetRide.GetRide) {
		super();
	}

	async run(request: HttpRequest<null>): Promise<any> {
		const rideId = request.params?.rideId;

		const ride = await this.useCase.execute({ rideId });

		return this.success(ride);
	}
}
