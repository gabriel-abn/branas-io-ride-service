import ApplicationError from "src/application/common/application-error";
import { z } from "zod";
import type { HttpRequest, HttpResponse } from "./http";

abstract class Controller<T = any> {
	constructor(private readonly schema: z.ZodObject<any> = z.object({})) {}

	abstract run(request: HttpRequest<T>): Promise<any>;

	protected validate(payload: any): T {
		const { data, success, error } = this.schema.safeParse(payload);

		if (!success) {
			throw new ApplicationError(error.message, "INVALID_REQUEST");
		}

		return data as T;
	}

	public async handle(request: HttpRequest<any>) {
		try {
			const payload = await this.validate(request.body);

			const result = await this.run({
				body: payload,
				params: request.params,
				query: request.query,
				headers: request.headers,
			});

			return result;
		} catch (error: any) {
			return this.serverError({ error: error.message });
		}
	}

	protected success(body: any, status = 200): HttpResponse {
		return {
			body,
			status,
			success: true,
		};
	}

	protected badRequest(body: any, status = 400): HttpResponse {
		return {
			body,
			status,
			success: false,
		};
	}

	protected serverError(body: any, status = 500): HttpResponse {
		return {
			body,
			status,
			success: false,
		};
	}
}

export default Controller;
