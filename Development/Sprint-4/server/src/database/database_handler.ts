import DataStore from "nedb";
import fs from "fs";
import * as path from "path";

class Database {
	private static instance: Database;
	private dataStore: { [key: string]: DataStore };
	private rootDirectory: string;

	// Updated constructor to accept a root directory parameter with a default value
	private constructor(rootDirectory: string) {
		this.rootDirectory = rootDirectory;
		this.dataStore = {};
		this.loadExistingCollections();
	}

	// Load existing collections using the specified root directory
	private loadExistingCollections() {
		if (!fs.existsSync(this.rootDirectory)) {
			fs.mkdirSync(this.rootDirectory);
		}
		const fileList = fs.readdirSync(this.rootDirectory);

		fileList?.forEach((file) => {
			const filePath = path.join(this.rootDirectory, file);
			this.dataStore[path.parse(file).name] = new DataStore({
				filename: filePath,
				timestampData: true,
				autoload: true,
			});
		});
	}

	// Static method to get the instance
	public static getInstance(): Database {
		const rootDirectory = "./data";
		
		if (!Database.instance) {
			if (!rootDirectory) {
				throw new Error(
					"Root directory must be specified for the first initialization."
				);
			}
			Database.instance = new Database(rootDirectory);
		} else if (
			rootDirectory &&
			rootDirectory !== Database.instance.rootDirectory
		) {
			throw new Error(
				"Cannot reinitialize singleton with a different root directory."
			);
		}
		return Database.instance;
	}
	public getDataStore(): { [key: string]: DataStore } {
		return this.dataStore;
	}

	// Create or load a new collection with options
	public loadCollection(collectionName: string, options: any) {
		if (!this.getDataStore()?.[collectionName]) {
			const filePath = path.join(this.rootDirectory, `${collectionName}.json`);
			this.dataStore[collectionName] = new DataStore({
				filename: filePath,
				...options,
			});
		}
		return this.getDataStore()[collectionName];
	}

	// Remove a collection and its file
	public unloadCollection(collectionName: string) {
		if (this.getDataStore()?.[collectionName]) {
			delete this.dataStore[collectionName];
			const filePath = path.join(this.rootDirectory, `${collectionName}.json`);
			fs.unlinkSync(filePath);
		}
	}
}

export default Database;
