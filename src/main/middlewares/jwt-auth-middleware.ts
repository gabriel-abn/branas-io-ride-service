import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import jwt from "jsonwebtoken";

export default async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
	const token = request.headers.authorization;
	if (!token) {
		reply.code(401).send({ message: "Unauthorized" });
		return;
	}

	try {
		const decoded = String(jwt.verify(token.replace("Bearer ", ""), "secret"));
		request.headers.account_id = decoded;
		done();
	} catch (error) {
		reply.code(401).send({ message: "Unauthorized" });
	}
};
