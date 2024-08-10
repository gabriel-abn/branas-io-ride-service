import type { IRideRepository } from "src/application/protocols/repositories";
import { Ride } from "src/domain/entities/ride";
import { Coordinate } from "src/domain/valueObjects/coordinate";
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

	async get(filter: Partial<{ rideId: string; passengerId: string; driverId: string }>): Promise<Ride[]> {
		try {
			if (filter.rideId) {
				const { rows } = await this.relationalDatabase.query(
					`
						SELECT ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long,
						fare, distance, status, request_date
						FROM app.ride
						WHERE ride_id = $1;
					`,
					[filter.rideId],
				);

				return rows.map((row: any) =>
					Ride.restore({
						rideId: row.ride_id,
						passengerId: row.passenger_id,
						driverId: row.driver_id,
						pickupLocation: new Coordinate({ latitude: Number(row.from_lat), longitude: Number(row.from_long) }),
						dropoffLocation: new Coordinate({ latitude: Number(row.to_lat), longitude: Number(row.to_long) }),
						fare: row.fare,
						distance: row.distance,
						status: row.status,
						requestDate: row.request_date,
					}),
				);
			}

			if (filter.driverId) {
				const { rows } = await this.relationalDatabase.query(
					`
						SELECT ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long,
						fare, distance, status, request_date
						FROM app.ride
						WHERE passenger_id = $1;
					`,
					[filter.passengerId],
				);

				return rows.map((row: any) =>
					Ride.restore({
						rideId: row.ride_id,
						passengerId: row.passenger_id,
						driverId: row.driver_id,
						pickupLocation: new Coordinate({ latitude: row.from_lat, longitude: row.from_long }),
						dropoffLocation: new Coordinate({ latitude: row.to_lat, longitude: row.to_long }),
						fare: row.fare,
						distance: row.distance,
						status: row.status,
						requestDate: row.request_date,
					}),
				);
			}

			if (filter.passengerId) {
				const { rows } = await this.relationalDatabase.query(
					`
						SELECT ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long,
						fare, distance, status, request_date
						FROM app.ride
						WHERE passenger_id = $1;
						`,
					[filter.passengerId],
				);

				return rows.map((row: any) =>
					Ride.restore({
						rideId: row.ride_id,
						passengerId: row.passenger_id,
						driverId: row.driver_id,
						pickupLocation: new Coordinate({ latitude: row.from_lat, longitude: row.from_long }),
						dropoffLocation: new Coordinate({ latitude: row.to_lat, longitude: row.to_long }),
						fare: row.fare,
						distance: row.distance,
						status: row.status,
						requestDate: row.request_date,
					}),
				);
			}

			throw new Error("RideRepository: Missing filter.");
		} catch (error: any) {
			throw new Error(`RideRepository: Failed to get ride. ${error.message}`);
		}
	}
}
