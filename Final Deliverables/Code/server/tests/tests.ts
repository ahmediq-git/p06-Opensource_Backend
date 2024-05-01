import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import getAllCollections from "@src/utils/collection-crud/getAllCollections";
import createCollection from "@src/utils/collection-crud/createCollection";
import deleteCollection from "@src/utils/collection-crud/deleteCollection";
import {
	createRecord,
	readRecord,
	updateRecord,
} from "@src/controllers/record-crud";
import createAdmin from "@src/utils/auth/admin/createAdmin";
import checkAdminExists from "@src/utils/auth/admin/checkAdminExists";
import getAdmins from "@src/utils/auth/admin/getAdmins";
import deleteAdmin from "@src/utils/auth/admin/deleteAdmin";
import checkLoginValid from "@src/utils/auth/admin/checkLoginValid";
import { fetchRules } from "@src/utils/rules/fetchRules";
import { updateRules } from "@src/utils/rules/updateRules";

describe("Collection CRUD", () => {
	beforeAll(async () => {
		const collections = await getAllCollections();
		console.log(collections);

		if (collections.length > 0 && collections.includes("testcol")) {
			await deleteCollection("testcol", true);
		}
	});

	test("Get all collections", async () => {
		const collections = await getAllCollections();

		expect(collections).toBeDefined();
		expect(collections.length).toBeGreaterThan(0);
		expect(collections).toContain("config");
		expect(collections).toContain("users");
		expect(collections).toContain("logs");
		expect(collections).toContain("functions");
	});

	test("Create collection", async () => {
		const collectionName = "testcol";
		const collection = await createCollection(collectionName);

		console.log("Collection: ", collection);

		expect(collection).toBeDefined();

		const collections = await getAllCollections();

		expect(collections).toBeDefined();
		expect(collections.length).toBeGreaterThan(0);
		expect(collections).toContain(collectionName);
	});

	test("Delete collection - force", async () => {
		const collectionName = "testcol";
		const collection = await deleteCollection(collectionName, true);

		expect(collection).toBeDefined();

		const collections = await getAllCollections();

		expect(collections).toBeDefined();
		expect(collections.length).toBeGreaterThan(0);
		expect(collections).not.toContain(collectionName);
	});

	afterAll(async () => {
		const collections = await getAllCollections();

		if (collections.length > 0 && collections.includes("testcol")) {
			await deleteCollection("testcol", true);
		}
	});
});

describe("Record CRUD", () => {
	beforeAll(async () => {
		const collections = await getAllCollections();

		if (collections.length > 0 && !collections.includes("record-crud-col")) {
			await createCollection("record-crud-col");
		}
	});

	test("Create record", async () => {
		const collectionName = "record-crud-col";
		const record: any = await createRecord({ name: "test" }, collectionName);

		expect(record).toBeDefined();
		expect(record?.name).toBe("test");
	});

	test("Read record", async () => {
		const collectionName = "record-crud-col";
		const record = await readRecord({ name: "test" }, collectionName);

		expect(record).toBeDefined();
		expect(record[0]?.name).toBe("test");
	});

	test("Read all records", async () => {
		const collectionName = "record-crud-col";
		const records = await readRecord({}, collectionName);

		expect(records).toBeDefined();
		expect(records.length).toBeGreaterThan(0);
	});

	test("Update record", async () => {
		const collectionName = "record-crud-col";
		const record = await readRecord({ name: "test" }, collectionName);

		expect(record).toBeDefined();
		expect(record[0]?.name).toBe("test");

		const updatedRecord = await updateRecord(collectionName, record.id, {
			name: "test",
			age: 25,
		});

		expect(updatedRecord).toBeDefined();
	});

	test("Delete record", async () => {
		const collectionName = "record-crud-col";
		const record = await readRecord({ name: "test" }, collectionName);

		expect(record).toBeDefined();
		expect(record[0]?.name).toBe("test");

		const deleted = await deleteCollection(collectionName, true);

		expect(deleted).toBeDefined();

		const collections = await getAllCollections();

		expect(collections).toBeDefined();
		expect(collections.length).toBeGreaterThan(0);
		expect(collections).not.toContain(collectionName);
	});

	afterAll(async () => {
		const collections = await getAllCollections();

		if (collections.length > 0 && collections.includes("record-crud-col")) {
			await deleteCollection("record-crud-col", true);
		}
	});
});

describe("Authentication - Admin", () => {
	test("Check if admin exists before creation", async () => {
		const admins = await getAdmins();

		const exists = admins.some((admin) => admin.email === "admins@admin.com");
		expect(exists).toBeDefined();
		expect(exists).toBe(false);
	});

	test("Create Admin User", async () => {
		const email = "admin@admin.com";
		const password = "admin";

		const admin = await createAdmin(email, password);

		expect(admin).toBeDefined();
	});

	test("Check if admin exists", async () => {
		const exists = await checkAdminExists();

		expect(exists).toBeDefined();
		expect(exists).toBe(true);
	});

	test("Get all Admin Users", async () => {
		const admins = await getAdmins();

		expect(admins).toBeDefined();
		expect(admins.length).toBeGreaterThan(0);
	});

	test("Login Admin User", async () => {
		const email = "admin@admin.com";
		const password = "admin";

		const admin = await checkLoginValid(email, password);

		expect(admin).toBeDefined();
		expect(admin).toBe(true);
	});

	test("Delete Admin User", async () => {
		const email = "admin@admin.com";

		const deleted = await deleteAdmin(email);

		expect(deleted).toBeDefined();
	});

	test("Check if admin exists after deletion", async () => {
		const admins = await getAdmins();
		const exists = admins.some((admin) => admin.email === "admin@admin.com");

		expect(exists).toBeDefined();
		expect(exists).toBe(false);
	});
});

describe("Rule based Access Control", () => {
	test("Fetch Rules", async () => {
		const rules = await fetchRules();

		expect(rules).toBeDefined();
		expect(rules).toHaveProperty("defaultRuleObject");
		expect(rules).toHaveProperty("userRules");
	});

	test("Update Rules", async () => {
		const rules = {
			defaultRuleObject: {
				read: true,
				write: true,
				delete: true,
			},
			userRules: {
				admin: {
					read: true,
					write: true,
					delete: true,
				},
				user: {
					read: true,
					write: false,
					delete: false,
				},
			},
		};

		const updated = await updateRules(rules);

		expect(updated).toBeDefined();
	});

	test("Fetch Rules after update", async () => {
		const rules = await fetchRules();

		expect(rules).toBeDefined();
		expect(rules).toHaveProperty("defaultRuleObject");
		expect(rules).toHaveProperty("userRules");
	}
	)
});
