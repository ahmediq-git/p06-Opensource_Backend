import { CollectionType } from "@src/core/init";
import DataStore from "nedb";
import Database from "@src/database/database_handler";

export default async function createCollection(
	collection_name: string
): Promise<any> {
	try {
		if (Database.getInstance().getDataStore()?.[collection_name]){
			throw new Error("Collection already exists")
		}
		
		const collection = Database.getInstance().loadCollection(collection_name, {autoload: true, timestampData: true})
		
		// new DataStore({
		// 	filename: `./data/${collection_name}.json`,
		// 	autoload: true,
		// 	timestampData: true,
		// });

		if (!collection) throw new Error("Failed to create collection");

		// update the config db to reflect the new collection
		const config_db = Database.getInstance().getDataStore()?.config
		
		// new DataStore({
		// 	filename: `./data/config.json`,
		// 	autoload: true,
		// });

		const config: any = await new Promise((resolve, reject) => {
			config_db.findOne({}, function (err, docs) {
				if (err) {
					reject(err);
				}
				resolve(docs);
			});
		});

		// check if the collection already exists
		const collectionExists = config.collections.find(
			(collection: any) => collection.name === collection_name
		);

		if (collectionExists) throw new Error("Collection already exists");

		config_db.update(
			{ _id: config._id },
			{
				$push: {
					collections: {
						name: collection_name,
						type: CollectionType.user,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				},
			},
			{},
			function (err, numReplaced) {
				if (err) {
					console.log(err);
					throw new Error("Failed to update config");
				}
			}
		);
		await config_db.persistence.compactDatafile()
		return "Collection created successfully";
	} catch (error) {
		return error;
	}
}
