import GetRideUseCase from "src/application/use-cases/get-ride-use-case";
import type { GetRide } from "src/domain/use-cases";
import Postgres from "src/infra/persistency/postgres";
import GetRideController from "src/presentation/controllers/get-ride-controller";
import { RideRepository } from "src/presentation/repositories/ride-repository";

export default class GetRideFactory {
	static makeUseCase(): GetRide.GetRide {
		return new GetRideUseCase(new RideRepository(Postgres.getInstance()));
	}

	static makeController(): GetRideController {
		return new GetRideController(GetRideFactory.makeUseCase());
	}
}
