// This follows the singleton design pattern as each collection DataStore object should only be created exactly once
// This is to ensure that a collection is instantiated just once as NeDB does not allow multiple instances of a DataStore object
import DataStore from "nedb";
import fs from "fs";
import * as path from "path";

class Database {
  private static instance: Database;
  private dataStore: { [key: string]: DataStore };

  // Declaring constructor as private so no other function can declare it
  private constructor() {
    this.dataStore = {};
    this.loadExistingCollections();
  }

  // Used to load any existing collections to the datastore
  private loadExistingCollections() {
    const dir = "./data";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const fileList = fs.readdirSync(dir);

    // Loading every single existing collection to the Database singleton
    fileList?.forEach((file) => {
      const filePath = `${dir}/${file}`;
      console.log(filePath)
      this.dataStore[path.parse(file).name] = new DataStore({
        filename: filePath,
        timestampData: true,
        autoload: true,
      });
    });
  }

  // to return the instance
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  //to obtain the object of all collection's datastore from the instantiated object
  public getDataStore(): { [key: string]: DataStore } {
    return this.dataStore;
  }

  // To add a new collection to the data store
  public loadCollection(collectionName: string, options: any) {
    if (!this.getDataStore()?.[collectionName]) {
      const filePath = `./data/${collectionName}.json`; // assuming the file extension is .db
      this.dataStore[collectionName] = new DataStore({
        filename: filePath,
        ...options,
      });
    }
    return this.getDataStore()[collectionName];
  }

  // to remove a collection from the data store
  public unloadCollection(collectionName: string) {
    if (this.getDataStore()?.[collectionName]) {
      delete this.dataStore[collectionName];
      // deleting file from the filesystem aswell
      const filePath = `./data/${collectionName}.json`;
      fs.unlinkSync(filePath);
    }
  }
}

export default Database;
