import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import server from "src/main/app/app";

describe("Request Ride", () => {
	const setupAccount = async () => {
		const inputSignUp = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: "Password123!@",
			accountId: "",
			carPlate: new RandExp(/[A-Z]{3}\d{4}/).gen(),
			cpf: faker.helpers.arrayElement(["97456321558", "71428793860", "87748248800"]),
			isDriver: true,
			isPassenger: false,
		};

		const outputSignUp = await fetch("http://localhost:3000/api/v1/account/sign-up", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(inputSignUp),
		}).then(async (response) => (await response.json()) as any);

		const inputLogin = {
			email: inputSignUp.email,
			password: inputSignUp.password,
		};

		const outputLogin = await fetch("http://localhost:3000/api/v1/account/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(inputLogin),
		}).then(async (response) => (await response.json()) as any);

		return { inputSignUp, outputSignUp, inputLogin, outputLogin };
	};

	it("should receive a ride request with passanger info", async () => {
		const { outputLogin, outputSignUp } = await setupAccount();

		const inputRequestRide = {
			fromLat: -27.584905257808835,
			fromLong: -48.545022195325124,
			toLat: -27.496887588317275,
			toLong: -48.522234807851476,
		};

		const outputRequestRide = await server
			.inject()
			.post("/api/v1/ride/request")
			.headers({
				authorization: `Bearer ${outputLogin.token}`,
			})
			.payload(inputRequestRide)
			.then(async (response) => {
				const payload = await response.json();
				expect(response.statusCode).toBe(200);
				return payload;
			});

		expect(outputRequestRide.rideId).toBeDefined();

		const outputGetRide = await server
			.inject()
			.get(`/api/v1/ride/${outputRequestRide.rideId}`)
			.headers({
				Authorization: `Bearer ${outputLogin.token}`,
			})
			.payload(inputRequestRide)
			.then(async (response) => {
				const payload = await response.json();
				expect(response.statusCode).toBe(200);
				return payload;
			});

		expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
		expect(outputGetRide.passengerId).toBe(outputSignUp.accountId);
		expect(outputGetRide.pickupLocation).toStrictEqual({
			latitude: inputRequestRide.fromLat,
			longitude: inputRequestRide.fromLong,
		});
		expect(outputGetRide.dropoffLocation).toStrictEqual({
			latitude: inputRequestRide.toLat,
			longitude: inputRequestRide.toLong,
		});
		expect(outputGetRide.status).toBe("REQUESTED");
	});

	it("should reject ride request if passanger has a requested ride", async () => {
		const { outputLogin } = await setupAccount();

		const inputRequestRide = {
			fromLat: -27.584905257808835,
			fromLong: -48.545022195325124,
			toLat: -27.496887588317275,
			toLong: -48.522234807851476,
		};

		const outputRequestRide = await server
			.inject()
			.post("/api/v1/ride/request")
			.headers({
				authorization: `Bearer ${outputLogin.token}`,
			})
			.payload(inputRequestRide)
			.then(async (response) => {
				const payload = await response.json();
				expect(response.statusCode).toBe(200);
				return payload;
			});

		expect(outputRequestRide.rideId).toBeDefined();

		await server
			.inject()
			.post("/api/v1/ride/request")
			.headers({
				Authorization: `Bearer ${outputLogin.token}`,
			})
			.payload(inputRequestRide)
			.then(async (response) => {
				const payload = await response.json();
				expect(response.statusCode).toBe(200);
				expect(payload.message).toBe("There is already a ride requested.");
				expect(payload.error).toBe("REQUESTED_RIDE_ALREADY_EXISTS");
			});
	});
});
