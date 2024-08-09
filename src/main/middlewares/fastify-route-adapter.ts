import type { FastifyReply, FastifyRequest } from "fastify";
import type Controller from "src/presentation/common/controller";
import type { HttpRequest } from "src/presentation/common/http";

export default (controller: Controller<any>) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const payload = {
				body: request.body,
				query: request.query,
				params: request.params,
				headers: request.headers,
			} as HttpRequest<any>;

			const result = await controller.handle(payload);

			reply.send(result.body).status(result.status);
		} catch (error: any) {
			reply.send({ error: "INTERNAL_SERVER_ERROR", message: error.message }).status(500);
		}
	};
};
