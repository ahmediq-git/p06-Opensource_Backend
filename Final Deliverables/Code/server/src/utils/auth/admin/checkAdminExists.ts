// import * as jose from "jose";
import Database from "@src/database/database_handler";

export default async function checkAdminExists() {
	const db = Database.getInstance().getDataStore()["config"];

	const config = new Promise<any[]>((resolve, reject) => {
		db.find({}, (err: any, doc: any) => {
			if (err) {
				reject(err);
			} else {	
				resolve(doc[0]?.admins);
			}
		});
	});
	
	const admins = await config;

	
	return admins.length > 0;
}
