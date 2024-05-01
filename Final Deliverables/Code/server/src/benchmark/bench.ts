import Datastore from "nedb";

const num_docs = 100000;

const nedb = async () => {
	const db = new Datastore({ filename: "./data.json", autoload: true });
	db.ensureIndex({ fieldName: "hello" });

	await measureInsertsNedb(db);
	await measureReadsNedb(db);
	await measureReadsNedbWithProjection(db);
	await measureReadsNedbWithProjectionAndLimit(db);
};

const measureInsertsNedb = async (db) => {
	// 1M inserts
	let doc = {
		hello: "world",
		n: 5,
		today: new Date(),
		nedbIsAwesome: true,
		notthere: null,
		notToBeSaved: undefined, // Will not be saved
		fruits: ["apple", "orange", "pear"],
		infos: { name: "nedb" },
	};

	const start = new Date();
	for (let i = 0; i < num_docs; i++) {
		await db.insert(doc);
	}
	const end = new Date();
	console.log(`Time taken to insert 100k records: ${end - start}ms`);

	// time per document
	console.log(`Time per document: ${(end - start) / num_docs}ms`);
	// documents per second
	console.log(`Documents per second: ${(num_docs / (end - start)) * 1000}ms`);
};

const measureReadsNedb = async (db) => {
	const start = new Date();

	await db.find({}, (err, docs) => {
		console.log("\n\n Reading all records");

		console.log("docs", docs.length);
		const end = new Date();
		console.log(`Time taken to read 100k records: ${end - start}ms`);

		// time per document
		console.log(`Time per document: ${(end - start) / num_docs}ms`);
		// documents per second
		console.log(`Documents per second: ${(num_docs / (end - start)) * 1000}ms`);
		console.log("done");
	});
};

const measureReadsNedbWithProjection = async (db) => {
	const start = new Date();
	await db.find({ hello: "world" }, (err, docs) => {
		console.log("\n\n Reading filtered records");

		console.log("docs", docs.length);

		console.log("done");

		const end = new Date();
		console.log(`Time taken to read records: ${end - start}ms`);

		// time per document
		console.log(`Time per document: ${(end - start) / num_docs}ms`);
		// documents per second
		console.log(`Documents per second: ${(num_docs / (end - start)) * 1000}ms`);
	});
};

const measureReadsNedbWithProjectionAndLimit = async (db) => {
	console.log("\n\n Reading filtered records with projection and limit");

	const start = new Date();
	await db
		.find({}, { hello: "world" })
		.limit(100)
		.exec((err, docs) => {
			console.log("\n\n Reading filtered records");

			console.log("docs", docs.length);

			console.log("done");

			const end = new Date();
			console.log(`Time taken to read 100k records: ${end - start}ms`);

			// time per document
			console.log(`Time per document: ${(end - start) / num_docs}ms`);
			// documents per second
			console.log(
				`Documents per second: ${(num_docs / (end - start)) * 1000}ms`
			);
		});
};

(async function main() {
	await nedb();
})();
