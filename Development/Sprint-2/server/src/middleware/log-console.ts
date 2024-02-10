import { Context } from "hono";
import{createRecord} from "@src/controllers/record-crud";
import DataStore from "nedb";

// // this middleware logs the request to the console
export const logConsole = async (c: Context, next: () => Promise<void>) => {
	const db = new DataStore({ filename: "./data/logs.json", timestampData: true,autoload: true});
	const log = {
		method: c.req.method,
		url: c.req.url,
	};

	// // const record = await createRecord(log, "logs");

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

	console.log(`[${new Date().toLocaleString()}] ${c.req.method} ${c.req.url}`);
	await next();
};
