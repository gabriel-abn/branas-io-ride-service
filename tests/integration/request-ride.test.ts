import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import server from "src/main/app/app";

it("should receive a ride request with passanger info", async () => {
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

	await fetch("http://localhost:3000/api/v1/account/sign-up", {
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
			console.log(payload);

			expect(response.statusCode).toBe(200);
			return payload;
		});

	expect(outputRequestRide.rideId).toBeDefined();

	// const outputGetRide = await server
	// 	.inject()
	// 	.get(`/api/v1/ride/${outputRequestRide.rideId}`)
	// 	.headers({
	// 		Authorization: `Bearer ${outputLogin.token}`,
	// 	})
	// 	.payload(inputRequestRide)
	// 	.then((response) => response.json());

	// expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	// expect(outputGetRide.passengerId).toBe(outputSignUp.passengerId);
	// expect(outputGetRide.passengerName).toBe("John Doe");
	// expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
	// expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
	// expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
	// expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
	// expect(outputGetRide.status).toBe("requested");
});
