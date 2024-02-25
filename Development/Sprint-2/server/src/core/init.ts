// this file is used to initialize the app
// What does initializing entail?
// Create the system-owned collections, which are
// 1. Users - Contains user data, this is a hybrid collection where some fields are user defined and some are system defined for auth
// 2. Logs - Contains per-request logs
// 3. Config - Includes smtp creds, logging behavior, S3 creds, Token secrets, Admins

import { deleteRecord, readRecord } from "@src/controllers/record-crud";
import { DataStoreObject } from "@src/utils/getCollection";
import DataStore from "nedb";
import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";

export enum CollectionType {
  user = "user",
  system = "system",
}

type Collection = {
  name: string;
  type: CollectionType;
  createdAt: string;
  updatedAt: string;
};

type Admin = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type AppConfig = {
  name: string; //app name
  url: string;
  admins: Admin[];
  s3: {
    endpoint: string;
    bucket: string;
    region: string;
    access_key: string;
    secret: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  backup: {
    auto: boolean;
    to_s3: boolean;
    backups: any[];
  };
  logs: {
    retention: number; //days
    ip_enabled: boolean;
  };
  collections: Collection[];
};

export async function Initialize() {
  console.log("Initializing app");

  const users_db = await LoadUsers();
  const logs_db = await LoadLogs();
  const config_db = await LoadConfig();

  await LogCullerSchedule() // cull logs based on retention

  return {
    users_db,
    logs_db,
    config_db,
  };
}

async function LogCullerSchedule(){
  const scheduler = new ToadScheduler();
  const task = new Task('cull logs', async () => {
  try {
      const config:any = new DataStore({
      filename: "./data/config.json",
      autoload: true,
      timestampData: true,
      });
      if (!config) throw new Error("Failed to get config");
      const appConfig: any = await new Promise((resolve, reject) => {
      config.findOne({}, function (err:any, docs:any) {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
      });
      if (!appConfig) throw new Error("Failed to get appConfig");
      const retentionInDays = appConfig.logs.retention;
      const currentTime = new Date();
      const retentionInMilliseconds = retentionInDays * 24 * 60 * 60 * 1000;
      const currentTimeMinusRetention = new Date(currentTime.getTime() - retentionInMilliseconds);
      await deleteRecord({createdAt: {$lte: currentTimeMinusRetention}}, {multi: true}, 'logs')
  }catch(err){
      console.log("In log culler",err);
      return err;
  }
  });
  const job = new SimpleIntervalJob(
    { seconds: 600, runImmediately: true },
    task, {
      id: 'id_1',
      preventOverrun: true
    });
  scheduler.addSimpleIntervalJob(job);
}

async function LoadUsers() {
  const db = new DataStore({
    filename: `./data/users.json`,
    autoload: true,
    timestampData: true,
  });

  // ensure that the username field is unique
  db.ensureIndex({ fieldName: "username", unique: true }, function (err) {
    if (err) {
      console.log(err);
    }
  });

  db.ensureIndex({ fieldName: "email", unique: true }, function (err) {
    if (err) {
      console.log(err);
    }
  });

  return db;
}

async function LoadLogs() {
  const db = new DataStore({
    filename: `./data/logs.json`,
    timestampData: true,
    autoload: true,
  }); //logs are not auto loaded, they are loaded on demand

  // db.ensureIndex({ fieldName: "request_id", unique: true }, function (err) {
  // 	if (err) {
  // 		console.log(err);
  // 	}
  // });

  return db;
}

async function LoadConfig() {
	const config = new DataStore({
		filename: `./data/config.json`,
		autoload: true,
		timestampData: true,
	});

	// get the current config object
	const configObject: any[] = await new Promise((resolve, reject) => {
		config.findOne({}, function (err, docs) {
			if (err) {
				reject(err);
			}

			resolve(docs);
		});
	});

	if (configObject && configObject?.length !== 0) return config; // just return the datastore if a config already exists

	console.log("Creating new config");
	
	const defaultConfig: AppConfig = {
		name: "Ezbase",
		url: "http://localhost:3690",
		admins: [],
		s3: null,
		smtp: null,
		backup: {
			auto: false,
			to_s3: false,
			backups: [],
		},
		logs: {
			retention: 30,
			ip_enabled: false,
		},
		collections: [
			{
				name: "users",
				type: CollectionType.system,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				name: "logs",
				type: CollectionType.system,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				name: "config",
				type: CollectionType.system,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		],
	};

	// create a config object if it does not exist
	const newConfig: any[] = await new Promise((resolve, reject) => {
		config.insert(defaultConfig, (err, doc: any) => {
			if (err) {
				reject(err);
			}

			resolve(doc);
		});
	});

	return newConfig;
}
