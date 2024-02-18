import { createRecord } from "@src/controllers/record-crud";
import { Context } from "hono";

// // this middleware logs the request to the console
export const logConsole = async (c: Context, next: () => Promise<void>) => {

	await createRecord({
		'url': c.req.path,
		'method': c.req.method
	}, 'logs')

	console.log(`[${new Date().toLocaleString()}] ${c.req.method} ${c.req.url}`);
	await next();
};
