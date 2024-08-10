import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import GetRideFactory from "../factories/get-ride-factory";
import RequestRideFactory from "../factories/request-ride-factory";
import fastifyRouteAdapter from "../middlewares/fastify-route-adapter";
import jwtAuthMiddleware from "../middlewares/jwt-auth-middleware";

const server = Fastify();

server.register(cors);

server.register(fastifyEnv, {
	dotenv: {
		path: ".env",
	},
	schema: {},
});

server.route({
	method: "POST",
	url: "/api/v1/ride/request",
	onRequest: jwtAuthMiddleware,
	handler: fastifyRouteAdapter(RequestRideFactory.makeController()),
	// handler: async (request, reply) => {
	// 	const controller = RequestRideFactory.makeController();
	// 	const payload = {
	// 		body: request.body,
	// 		query: request.query,
	// 		params: request.params,
	// 		headers: request.headers,
	// 	} as HttpRequest<any>;
	// 	const response = await controller.run(payload);

	// 	reply.send(response.body).status(response.status);
	// },
});

server.route({
	method: "GET",
	url: "/api/v1/ride/:rideId",
	onRequest: jwtAuthMiddleware,
	handler: fastifyRouteAdapter(GetRideFactory.makeController()),
});

export default server;
