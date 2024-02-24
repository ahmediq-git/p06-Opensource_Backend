import DataStore from "nedb";
import { unlink } from "node:fs/promises";

export default async function deleteCollection(
	name: string,
	force: boolean
): Promise<any> {
	try {
		const config = new DataStore({
			filename: `./data/config.json`,
			autoload: true,
			timestampData: true,
		});

		if (!config) throw new Error("Failed to get config");

		const appConfig: any = await new Promise((resolve, reject) => {
			config.findOne({}, function (err, docs) {
				if (err) {
					reject(err);
				}
				resolve(docs);
			});
		});

		if (!appConfig) throw new Error("Failed to get appConfig");

		const collectionExists = appConfig.collections.find(
			(collection: any) => collection.name === name
		);

		if (!collectionExists) throw new Error("Collection does not exist");

		// check if collection is empty
		const collection = new DataStore({
			filename: `./data/${name}.json`,
			autoload: true,
			timestampData: true,
		});

		if (!force) { //force delete
			const collectionCount: number = await new Promise((resolve, reject) => {
				collection.count({}, function (err, count) {
					if (err) {
						reject(err);
					}
					resolve(count);
				});
			});
			if (collectionCount > 0) throw new Error("Collection is not empty");
		}

		config.update(
			{ _id: appConfig._id },
			{
				$pull: {
					collections: {
						name,
					},
				},
			},
			{},
			function (err, numReplaced) {
				if (err) {
					console.log(err);
					throw new Error("Failed to update config");
				}
				console.log(numReplaced);
			}
		);
		await unlink(`./data/${name}.json`);
		await config.persistence.compactDatafile();
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
