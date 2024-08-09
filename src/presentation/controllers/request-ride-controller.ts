import type { RequestRide } from "src/domain/use-cases";
import { z } from "zod";
import Controller from "../common/controller";
import type { HttpRequest } from "../common/http";

export const RequestRideSchema = z.object({
	fromLat: z.number({}),
	fromLong: z.number({}),
	toLat: z.number({}),
	toLong: z.number({}),
});

export type RequestRideRequest = z.infer<typeof RequestRideSchema>;

export class RequestRideController extends Controller<RequestRideRequest> {
	constructor(private readonly useCase: RequestRide.RequestRide) {
		super(RequestRideSchema);
	}

	async run(request: HttpRequest<RequestRideRequest>) {
		const passangerId = request.headers?.account_id;

		const result = await this.useCase.execute({
			passangerId,
			from: {
				latitute: request.body.fromLat,
				longitude: request.body.fromLong,
			},
			to: {
				latitute: request.body.toLat,
				longitude: request.body.toLong,
			},
		});

		return this.success(result);
	}
}
