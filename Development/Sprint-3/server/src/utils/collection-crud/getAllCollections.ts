import { getCollection } from "../getCollection";

export default async function getAllCollections(): Promise<string[] | []> {
	const config = getCollection("config");
	const collections: string[] = [];
	try {
		const config_data = new Promise<any[]>((resolve, reject) => {
			config.find({}, function (err: Error | null, docs: any) {
				if (err) {
					reject(err);
				}
				let coll_data: any[] = docs[0].collections;

				resolve(coll_data);
			});
		});

		const coll_data = await config_data;

		coll_data.forEach((coll) => {
			collections.push(coll.name);
		});
		return collections;
	} catch (err) {
		console.error("Error occurred while fetching collections:", err);
		return [];
	}
}
