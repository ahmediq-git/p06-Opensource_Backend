
import Database from "@src/database/database_handler";

export default async function deleteAdmin(email: string): Promise<any> {
	const db = Database.getInstance().getDataStore()["config"];

	const config: any = await new Promise((resolve, reject) => {
		db.find({}, (err: any, doc: any) => {
			if (err) {
				reject(err);
			}

			resolve(doc);
		});
	});

	let exists = false;

	// check if admin with this email already exists
	if (config.length > 0) {
		const admins = config[0]?.admins;

		for (let i = 0; i < admins.length; i++) {
			if (admins[i].email === email) {
				exists = true;
				break;
			}
		}
	}

	if (!exists) {
		return "Admin does not exist";
	}

	const removed = await new Promise((resolve, reject) => {
		db.update(
			{},
			{
				$pull: {
					admins: {
						email: email,
					},
				},
			},
			{ upsert: false },
			function (err, numReplaced, upsert) {
				if (err) {
					reject(err);
				}
				resolve("Admin removed");
			}
		);
	});

	return removed;
}
