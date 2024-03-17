// this defines a pipeline for generating queries
// based on the state of the options object passed in, the query will be generated which can later be executed using the exec() method in nedb

import { DataStoreObject } from "@src/utils/getCollection";

export interface QueryOptions {
	sort?: {
		[key: string]: number;
	};
	limit?: number;
	offset?: number;
}
export interface QueryObject {
	[key: string]: any;
}

export async function generateQuery(
	query: QueryObject,
	options: QueryOptions,
	db: DataStoreObject
) {
	const { sort, limit, offset } = options;
	const queryObject = db.find(query);

	if (sort) queryObject.sort(sort);
	if (limit) queryObject.limit(limit);
	if (offset) queryObject.skip(offset);

	return queryObject;
}
