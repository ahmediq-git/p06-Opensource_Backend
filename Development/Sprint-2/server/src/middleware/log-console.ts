import { createRecord } from "@src/controllers/record-crud";
import { Context } from "hono";
import DataStore from "nedb";
import sizeof from "object-sizeof";

// // this middleware logs the request to the console
export const logConsole = async (c: Context, next: () => Promise<void>) => {
	console.log(`[${new Date().toLocaleString()}] ${c.req.method} ${c.req.url}`);
	const start = performance.now()
	await next();
	const end = performance.now()
	const time_taken = (end - start).toFixed(2)
	if(!c.req.url.includes('list?collection_name=logs')){ // dont log the fetching of logs
	const db = new DataStore({ filename: "./data/logs.json", timestampData: true, autoload: true});
	const log = {
		method: c.req.method,
		url: c.req.url,
		status: c.res.status,
		time_taken,
		origin: c.req.raw.headers.get("origin"),
		request_size: sizeof(c.req),
		response_size: sizeof(c.res)
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
	}
};
