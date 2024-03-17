import { generateQuery } from "@src/utils/record-crud/generateQuery";
import { getCollection } from "@utils/getCollection";

export interface QueryObject {
	[key: string]: any;
}

export async function createRecord(
	record: QueryObject,
	collection_name: string
) {
	return new Promise((resolve, reject) => {
		const collection = getCollection(collection_name);
		
		collection.insert(record, function (err: Error | null, new_doc: any) {
			if (err) {
				reject(err);
			}

			resolve(new_doc);
		});
	});
}

export async function readRecord(
	fields: QueryObject,
	collection_name: string
): Promise<any> {
	const collection = getCollection(collection_name);

	const docs = new Promise((resolve, reject) => {
		collection.find(fields, function (err: Error | null, docs: any) {
			if (err) {
				reject(err);
			}
			resolve(docs);
		});
	});

	return docs;
}

export function updateRecord(collection_name: string, id: string, record: any) {
	return new Promise((resolve, reject) => {
		const collection = getCollection(collection_name);
		collection.update(
			{ _id: id },
			record,
			{},
			function (err: Error | null, num_replaced: number) {
				if (err) {
					reject(err);
				}

				resolve(num_replaced);
			}
		);
	});
}

export interface DeleteRecordOptions {
	multi: boolean;
}

export async function deleteRecord(
	query: QueryObject,
	queryOptions: DeleteRecordOptions,
	collection_name: string
): Promise<number | string> {
	return new Promise<number | string>((resolve, reject) => {
		const collection = getCollection(collection_name);

		collection.remove(
			query,
			queryOptions,
			function (err: Error | null, num_removed: number) {
				if (err) {
					console.log("Error: ", err)
					reject(err);
				}

				resolve(num_removed);
			}
		);
	});
}

export interface ListRecordsOptions {
	sort: {
		[key: string]: number;
	};
	limit: number;
	offset: number;
}

export async function listRecords(
	query: QueryObject,
	queryOptions: ListRecordsOptions,
	collection_name: string
) {
	return new Promise(async (resolve, reject) => {
		const collection = getCollection(collection_name);

		if (!collection) throw new Error("No collection found");

		const generated_query = await generateQuery(
			query,
			queryOptions,
			collection
		);

		generated_query.exec(function (err: Error | null, docs: any) {
			if (err) {
				reject(err);
			}

			resolve(docs);
		});
	});
}

export interface CountOptions {
	query: {
		[key: string]: any;
	};
}

export async function countRecords(
	query: CountOptions,
	collection_name: string
) {
	const count = new Promise((resolve, reject) => {
		const collection = getCollection(collection_name);

		if (!collection) throw new Error("No collection found");

		collection.count(query, function (err: Error | null, count: number) {
			if (err) {
				reject(err);
			}

			resolve(count);
		});
	});

	return count;
}
