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
import { sse } from "@src/index";

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
		
		sse.emit('broadcastRecord',{collection_name,record});  //for realtime updates

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
	embed: string
}

records.get("/read", async (c) => {
	try {
		const params = c.req.query();

		const { query, collection_name, embed } = params as ReadQueryParams;

		if (!query) throw new Error("No query provided");
		if (!collection_name) throw new Error("No collection name provided");

		const queryJson = JSON.parse(query);

		const record = await readRecord(queryJson, collection_name)
		let embed_referenced_doc = false;
		embed == 'true' ? embed_referenced_doc = true : false
		if (embed_referenced_doc) {
			for (let i = 0; i < record.length; i++) {
				for (const key of Object.keys(record[i])) {
					try {
						// if record contains an object with a type foreign_key, return the referenced document
						// embedded in the document to be read
						if (typeof record[i][key] === 'object' && 'type' in record[i][key] && record[i][key]['type'] == 'foreign_key') {
							let query = {
								'_id': record[i][key]['ref']
							};
							let embedded_record = await readRecord(query, record[i][key]['collection']);
							record[i][key] = embedded_record;
						}
					} catch (err) {
						// If referenced doc has been deleted, set the embedded doc to null
						record[i][key] = null;
					}
				}
			}
		}
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

records.patch("/update", async (c) => {
	try {
		const { collection_name, id, new_record } = await c.req.json();

		if (!collection_name) throw new Error("No collection name provided");
		if (!id) throw new Error("No id provided");
		if (typeof new_record !== "object") throw new Error("New record must be an object");

		const record = await updateRecord(collection_name, id._id, new_record);

		return c.json({
			data: new_record,
			error: null
		});

	} catch (error) {
		return c.json({
			data: null,
			error: "Failed to update record"
		});
	}
})

records.delete("/delete", async (c) => {
	try {
		const { collection_name, query, queryOptions } = await c.req.json();

		if (!collection_name) throw new Error("No collection name provided");
		if (!query) throw new Error("No query provided");
		if (typeof query !== "object") throw new Error("Query must be an object");

		const record = await deleteRecord(query, queryOptions, collection_name);
		// try{
		// 	app.subscriptions[collection_name]?.forEach((socket: Socket) => {
		// 		socket.emit('recordRemoved', {
		// 			collection_name,
		// 		});
		// 	})
		// 	}catch(err){
		// 		console.log(err);
		// 	}
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
		const { collection_name, query, queryOptions, embed } = params as {
			collection_name: string;
			query: string;
			queryOptions: string;
			embed: string
		};

		if (!collection_name) throw new Error("No collection name provided");

		const queryJson = query ? JSON.parse(query) : {};
		const queryOptionsJson = queryOptions ? JSON.parse(queryOptions) : {};

		const records:any = await listRecords(
			queryJson,
			queryOptionsJson,
			collection_name
		);

		let embed_referenced_doc = false;
		embed == 'true' ? embed_referenced_doc = true : false
		if (embed_referenced_doc) {
			for (let i = 0; i < records.length; i++) {
				for (const key of Object.keys(records[i])) {
					try {
						// if record contains an object with a type foreign_key, return the referenced document
						// embedded in the document to be read
						if (typeof records[i][key] === 'object' && 'type' in records[i][key] && records[i][key]['type'] == 'foreign_key') {
							let query = {
								'_id': records[i][key]['ref']
							};
							let embedded_record = await readRecord(query, records[i][key]['collection']);
							records[i][key] = embedded_record;
						}
					} catch (err) {
						// If referenced doc has been deleted, set the embedded doc to null
						records[i][key] = null;
					}
				}
			}
		}

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
