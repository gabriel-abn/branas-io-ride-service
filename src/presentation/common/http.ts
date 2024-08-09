export type HttpRequest<T = any> = {
	body: T;
	query?: { [key: string]: any };
	params?: { [key: string]: any };
	headers?: { [key: string]: any };
};

export type HttpResponse = {
	body: any;
	status: number;
	success: boolean;
};
