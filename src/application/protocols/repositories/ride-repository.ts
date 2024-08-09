import type { Ride } from "src/domain/entities/ride";

export interface IRideRepository {
	save(ride: Ride): Promise<void>;
}
