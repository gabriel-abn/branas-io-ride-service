import type { Ride } from "src/domain/entities/ride";

export interface IRideRepository {
	save(ride: Ride): Promise<void>;
	get(filter: Partial<{ rideId: string; passengerId: string; driverId: string }>): Promise<Ride[]>;
}
