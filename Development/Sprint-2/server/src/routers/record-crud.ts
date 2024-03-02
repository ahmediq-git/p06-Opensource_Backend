import { Hono } from "hono";
import {
	createRecord,
	readRecord,
	updateRecord,
	deleteRecord,
	listRecords,
	countRecords,
} from "@src/controllers/record-crud";
import getAllCollections from "@src/utils/collection-crud/getAllCollections";

const records = new Hono();

records.post("/create", async (c) => {
	try {
		const { collection_name, query } = await c.req.json();		

		if (!collection_name) throw new Error("No collection name provided");
		if (!query) throw new Error("No query provided");
		if (typeof query !== "object") throw new Error("Query must be an object");

		// check if collection exists, if not, deny the request
		const collections: string[] = await getAllCollections();
		if (!collections.includes(collection_name))
			throw new Error("Collection does not exist");

		const record = await createRecord(query, collection_name);

		return c.json({
			data: record,
			error: null,
		});
	} catch (error) {
		console.log(error);

		return c.json({
			data: null,
			error: "Failed to create record",
		});
	}
});

interface ReadQueryParams extends Record<string, string> {
	query: string;
	collection_name: string;
}

records.get("/read", async (c) => {
	try {
		const params = c.req.query();

		const { query, collection_name } = params as ReadQueryParams;

		if (!query) throw new Error("No query provided");
		if (!collection_name) throw new Error("No collection name provided");

		const queryJson = JSON.parse(query);

		const record = await readRecord(queryJson, collection_name);

		return c.json({
			data: record,
			error: null,
		});
	} catch (error) {
		console.log(error);

		return c.json({
			data: null,
			error: "Failed to read record",
		});
	}
});

records.delete("/delete", async (c) => {
	try {
		const { collection_name, query, queryOptions } = await c.req.json();

		if (!collection_name) throw new Error("No collection name provided");
		if (!query) throw new Error("No query provided");
		if (typeof query !== "object") throw new Error("Query must be an object");

		const record = await deleteRecord(query, queryOptions, collection_name);

		return c.json({
			data: record,
			error: null,
		});
	} catch (error) {
		console.log(error);

		return c.json({
			data: null,
			error: "Failed to delete record",
		});
	}
});

records.get("/list", async (c) => {
	try {
		const params = c.req.query();
		const { collection_name, query, queryOptions } = params as {
			collection_name: string;
			query: string;
			queryOptions: string;
		};

		if (!collection_name) throw new Error("No collection name provided");

		const queryJson = query ? JSON.parse(query) : {};
		const queryOptionsJson = queryOptions ? JSON.parse(queryOptions) : {};

		const records = await listRecords(
			queryJson,
			queryOptionsJson,
			collection_name
		);

		return c.json({
			data: records,
			error: null,
		});
	} catch (error) {
		console.log(error);

		return c.json({
			data: null,
			error: "Failed to list records",
		});
	}
});

records.get("/count", async (c) => {
	try {
		const params = c.req.query();

		const { collection_name, query } = params as {
			collection_name: string;
			query: string;
		};

		if (!collection_name) throw new Error("No collection name provided");

		const queryJson = query ? JSON.parse(query) : {};

		const count = await countRecords(queryJson, collection_name);

		return c.json({
			data: {
				query: queryJson,
				count,
			},
			error: null,
		});
	} catch (error) {
		console.log(error);

		return c.json({
			data: null,
			error: "Failed to count records",
		});
	}
});

// records.put("/update", async (c) => {
// 	try {
// 		const { collection_name, query, queryOptions, update } = await c.req.json();

// 		if (!collection_name) throw new Error("No collection name provided");
// 		if (!query) throw new Error("No query provided");
// 		if (typeof query !== "object") throw new Error("Query must be an object");
// 		if (!update) throw new Error("No update provided");
// 		if (typeof update !== "object") throw new Error("Update must be an object");

// 		const record = await updateRecord(
// 			query,
// 			queryOptions,
// 			update,
// 			collection_name
// 		);

// 		return c.json({
// 			data: record,
// 			error: null,
// 		});
// 	} catch (error) {
// 		console.log(error);

// 		return c.json({
// 			data: null,
// 			error: "Failed to update record",
// 		});
// 	}
// });

export default records;
