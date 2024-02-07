import { Context } from "hono";

// // this middleware logs the request to the console
export const logConsole = async (c: Context, next: () => Promise<void>) => {
	console.log(`[${new Date().toLocaleString()}] ${c.req.method} ${c.req.url}`);
	await next();
};
