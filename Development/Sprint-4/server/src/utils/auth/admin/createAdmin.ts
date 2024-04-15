
import Database from "@src/database/database_handler";

export default async function createAdmin(
	email: string,
	password: string
): Promise<any> {
	const db = Database.getInstance().getDataStore()["config"];

	const hashedpassword = await Bun.password.hash(password);

	const config: any = await new Promise((resolve, reject) => {
		db.find({}, (err: any, doc: any) => {
			if (err) {
				reject(err);
			}

			resolve(doc);
		});
	});

	// check if admin with this email already exists
	if (config.length > 0) {
		const admins = config[0].admins;

		for (let i = 0; i < admins.length; i++) {
			if (admins[i].email === email) {
				return "Admin already exists";
			}
		}
	}

	const updated = await new Promise((resolve, reject) => {
		db.update(
			{ },
			{
				$push: {
					admins: {
						email: email,
						password: hashedpassword,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				},
			},
			{ upsert: false },
			function (err, numReplaced, upsert) {
				if (err) {
					reject(err);
				}
				resolve("Admin created");
			}
		);
	});

	return updated;
}
