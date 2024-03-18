import Database from "@src/database/database_handler";

export default async function getAdmins(): Promise<any> {
	const db = Database.getInstance().getDataStore()["config"];

	const config: any = await new Promise((resolve, reject) => {
		db.find({}, (err: any, doc: any) => {
			if (err) {
				reject(err);
			}

			resolve(doc);
		});
	});

	return config[0].admins.map((admin: any) => {
		return {
			email: admin.email,
			createdAt: admin.createdAt,
			updatedAt: admin.updatedAt,
		};
	});
}
