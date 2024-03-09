import DataStore from "nedb";
import Database from "../database/database_handler"

export interface CrudOptions {
	autoload: boolean;
	timestampData: boolean;
}

export function getCollection(
	name: string,
	options: CrudOptions = { autoload: true, timestampData: true }
) {
	// we don't need options
	// const db = new DataStore({ filename: `./data/${name}.json`, ...options });
	const db = Database.getInstance().getDataStore()[name]
	return db;
}

export type DataStoreObject = ReturnType<typeof getCollection>;
