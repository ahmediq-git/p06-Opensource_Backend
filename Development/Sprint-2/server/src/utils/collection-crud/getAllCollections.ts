import { readdir } from "node:fs/promises";

export default async function getAllCollections(): Promise<string[] | []> {
	try {
		const collections: string[] = [];
		const files = await readdir("./data");

		files.forEach((file) => {
			const name = file.split(".")[0];
			collections.push(name);
		});
		return collections;
	} catch (error) {
		console.log(error);
		return [];
	}
}
