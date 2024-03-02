import { createRecord } from "@src/controllers/record-crud";
import { Context } from "hono";
import DataStore from "nedb";

// // this middleware logs the request to the console
export const logConsole = async (c: Context, next: () => Promise<void>) => {
	console.log(`[${new Date().toLocaleString()}] ${c.req.method} ${c.req.url}`);
	const start = performance.now()
	await next();
	const end = performance.now()
	const time_taken = (end - start).toFixed(2)
	const db = new DataStore({ filename: "./data/logs.json", timestampData: true,autoload: true});
	const log = {
		method: c.req.method,
		url: c.req.url,
		status: c.res.status,
		time_taken,
		origin: c.req.raw.headers.get("origin")
	};
	const insert = await new Promise<string>((resolve, reject) => {   //dont await for promise
		db.insert(log, function (err: any, newDoc: any) {
			if (err) {
				reject(err);
			}else{
				resolve(newDoc);
			}
		});
	}).catch((err:any) => {
		console.log("Error inserting log: ",err);
	});
};
