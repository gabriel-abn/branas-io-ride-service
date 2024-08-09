import RequestRideUseCase from "src/application/use-cases/request-ride-use-case";
import type { RequestRide } from "src/domain/use-cases";
import Postgres from "src/infra/persistency/postgres";
import { RequestRideController } from "src/presentation/controllers/request-ride-controller";
import { RideRepository } from "src/presentation/repositories/ride-repository";

export default class RequestRideFactory {
	static makeUseCase(): RequestRide.RequestRide {
		return new RequestRideUseCase(new RideRepository(Postgres.getInstance()));
	}

	static makeController(): RequestRideController {
		return new RequestRideController(RequestRideFactory.makeUseCase());
	}
}
