import type { IRideRepository } from "src/application/protocols/repositories";
import type { Ride } from "src/domain/entities/ride";
import type RelationalDatabase from "../common/relational-database";

export class RideRepository implements IRideRepository {
	constructor(private readonly relationalDatabase: RelationalDatabase) {}

	async save(ride: Ride): Promise<void> {
		try {
			const saved = await this.relationalDatabase.execute(
				`
        INSERT INTO app.ride
        (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, fare, distance, status, request_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `,
				[
					ride.id,
					ride.passengerId,
					ride.pickupLocation.latitude,
					ride.pickupLocation.longitude,
					ride.dropoffLocation.latitude,
					ride.dropoffLocation.longitude,
					ride.fare,
					ride.distance,
					ride.status,
					ride.requestDate,
				],
			);

			if (!saved.executed) {
				throw new Error("Query failed to execute.");
			}

			if (saved.rowsAffected !== 1) {
				throw new Error("Ride was not saved.");
			}
		} catch (error: any) {
			throw new Error(`RideRepository: Failed to save ride. ${error.message}`);
		}
	}
}
