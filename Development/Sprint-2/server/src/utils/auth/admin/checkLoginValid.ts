import Database from "@src/database/database_handler";

export default async function checkLoginValid(
	email: string,
	password: string
): Promise<any> {
	const db = Database.getInstance().getDataStore()["config"];

	const config: any = await new Promise((resolve, reject) => {
		db.find({}, (err: any, doc: any) => {
			if (err) {
				reject(err);
			}

			resolve(doc);
		});
	});

	if (config.length === 0) {
		return false;
	}

	const admins = config[0].admins;

	for (let i = 0; i < admins.length; i++) {
		if (admins[i].email === email) {
			if (await Bun.password.verify(password, admins[i].password)) {
				return true;
			}
		}
	}

	console.log("Invalid login");
	
	return false;
}
