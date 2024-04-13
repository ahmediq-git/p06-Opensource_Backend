import createCollection from "@src/utils/collection-crud/createCollection";
import deleteCollection from "@src/utils/collection-crud/deleteCollection";
import getAllCollections from "@src/utils/collection-crud/getAllCollections";
import { fetchRules } from "@src/utils/rules/fetchRules";
import { updateRules } from "@src/utils/rules/updateRules";
import { Context, Hono } from "hono";

const collections = new Hono();

// return all collections
collections.get("/", async (c: Context) => {
	try {
		const collections = await getAllCollections();
		// remove system collections
		// config, logs
		const systemCollections = ["config", "logs", "functions"];

		return c.json({
			data: collections.filter(
				(collection) => !systemCollections.includes(collection)
			),
			error: null,
		});
	} catch (error) {
		console.log(error);
		return c.json({ error, data: null });
	}
});

collections.post("/create", async (c: Context) => {
	try {
		const { collection_name } = await c.req.json();

		const collection = await createCollection(collection_name);

		if (!collection) throw new Error("Failed to create collection");

		// when collection is created, we need an entry in rules
		const rules = await fetchRules()

		if (!rules) throw new Error("Failed to fetch rules")

		await updateRules({
			userRules: {
				...rules.userRules,
				[collection_name]: {'1': [['', 'eq', '', 'None'],{
					createCollection: false,
					deleteCollection: false,
					createRecord: false,
					readRecord: false,
					updateRecord: false,
					deleteRecord: false,
				}]}
			},
			defaultRuleObject: {
				...rules.defaultRuleObject,
				[collection_name]: {
					createCollection: false,
					deleteCollection: false,
					createRecord: false,
					readRecord: false,
					updateRecord: false,
					deleteRecord: false,
				}
			}
		})
		return c.json({ data: collection, error: null });
	} catch (error) {
		console.log(error);
		return c.json({ error, data: null });
	}
});

collections.delete("/:collection_name", async (c: Context) => {
	try {
		const { collection_name } = c.req.param();

		if (!collection_name) throw new Error("No collection name provided");

		// delete the collection
		const deleted = await deleteCollection(collection_name, true);

		if (!deleted) throw new Error("Failed to delete collection");

		// when collection is deleted, remove entry from rules
		const rules = await fetchRules()

		if (!rules) throw new Error("Failed to fetch rules")
		delete rules.userRules[collection_name];
		delete rules.defaultRuleObject[collection_name];

		await updateRules({
			userRules: { ...rules.userRules },
			defaultRuleObject: { ...rules.defaultRuleObject }
		});

		return c.json({ data: deleted, error: null });
	} catch (error) {
		console.log(error);

		return c.json({ error: "Failed to delete collection", data: null });
	}
});

collections.delete("/force/:name", async (c: Context) => {
	try {
		const { name } = c.req.param();

		if (!name) throw new Error("No collection name provided");

		// delete the collection
		const deleted = await deleteCollection(name, true);

		if (!deleted) throw new Error("Failed to delete collection");

		// when collection is deleted, remove entry from rules
		const rules = await fetchRules()

		if (!rules) throw new Error("Failed to fetch rules")
		delete rules.userRules[collection_name];
		delete rules.defaultRuleObject[collection_name];

		await updateRules({
			userRules: { ...rules.userRules },
			defaultRuleObject: { ...rules.defaultRuleObject }
		});
		
		return c.json({ data: deleted, error: null });
	} catch (error) {
		console.log(error);

		return c.json({ error: "Failed to delete collection", data: null });
	}
});

export default collections;
