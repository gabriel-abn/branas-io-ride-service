import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import Fastify from "fastify";

const server = Fastify();

server.register(cors);

server.register(fastifyEnv, {
	dotenv: {
		path: ".env",
	},
});

export default server;
