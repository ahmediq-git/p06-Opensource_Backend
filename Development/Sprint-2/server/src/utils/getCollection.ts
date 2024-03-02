import DataStore from "nedb";

export interface CrudOptions {
	autoload: boolean;
	timestampData: boolean;
}

export function getCollection(
	name: string,
	options: CrudOptions = { autoload: true, timestampData: true }
) {
	const db = new DataStore({ filename: `./data/${name}.json`, ...options });
	return db;
}

export type DataStoreObject = ReturnType<typeof getCollection>;
