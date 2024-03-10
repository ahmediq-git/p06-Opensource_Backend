// this file is used to initialize the app
// What does initializing entail?
// Create the system-owned collections, which are
// 1. Users - Contains user data, this is a hybrid collection where some fields are user defined and some are system defined for auth
// 2. Logs - Contains per-request logs
// 3. Config - Includes smtp creds, logging behavior, S3 creds, Token secrets, Admins

import { deleteRecord, readRecord } from "@src/controllers/record-crud";
import Database from "@src/database/database_handler";
import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";
import fs from 'fs';

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
  application: {
    name: string;
    url: string;
  };
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
  const functions = await LoadFunctions();

  await LogCullerSchedule(); // cull logs based on retention
  await FunctionRunner(); // to run periodic functions

  return {
    users_db,
    logs_db,
    config_db,
  };
}

async function LogCullerSchedule() {
  const scheduler = new ToadScheduler();
  const task = new Task('cull logs', async () => {
    try {
      const config = Database.getInstance().getDataStore()?.['config'];;
  
      if (!config) throw new Error("Failed to get config");
      const appConfig: any = await new Promise((resolve, reject) => {
        config.findOne({}, function (err: any, docs: any) {
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
      await deleteRecord({ createdAt: { $lte: currentTimeMinusRetention } }, { multi: true }, 'logs')
    } catch (err) {
      console.log("In log culler", err);
      return err;
    }
  });
  const job = new SimpleIntervalJob(
    { seconds: 600, runImmediately: false },
    task, {
    id: 'id_1',
    preventOverrun: true
  });
  scheduler.addSimpleIntervalJob(job);
}

async function FunctionRunner() {
  const scheduler = new ToadScheduler();
  const task = new Task('run functions', async () => {
    try {
      const functions = Database.getInstance().getDataStore()?.['functions'];
 
      const allFunctions: any[] = await new Promise((resolve, reject) => {
        functions.find({}, function (err: any, docs: any) {
          if (err) {
            reject(err);
          }
          resolve(docs);
        });
      });
      for (let x = 0; x < allFunctions.length; x++) {
        let lastRun = allFunctions[x].lastRun;
        // Check if lastRun is not null
        let functLastRun = (lastRun !== null && lastRun != undefined ) ? lastRun.getTime() / 1000 : 0; // convert to seconds
        let functRunAfter = allFunctions[x].runAfter;
        let currentTime = ((new Date()).getTime()) / 1000;
        // run function if more time elapsed than alloted
        if (currentTime - functLastRun > functRunAfter) {
          let op = allFunctions[x].op;
          // what to do if op is export 
          if (op == "export") {
            let to_export = allFunctions[x].toExport;
            let out_name = allFunctions[x].outName;
            const to_export_datastore = Database.getInstance().getDataStore()?.[to_export]
            
            const data_to_export: any[] = await new Promise((resolve, reject) => {
              to_export_datastore.find({}, function (err: any, docs: any) {
                if (err) {
                  reject(err);
                }
                resolve(docs);
              });
            });
            var dir = './exports';
            // make sure directory exists before writing to file
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            fs.writeFileSync(`./exports/${out_name}.txt`, JSON.stringify(data_to_export));
            functions.update(allFunctions[x], { $set: { lastRun: new Date() } }, {}, function (err, numReplaced) {
            });
            console.log(`${to_export} exported`);
          }
          // what to do if op is backup
          else if (op == "backup") {
            let to_backup = allFunctions[x].toBackup;
            for (let i = 0; i < to_backup.length; i++) {
              var dir = './backups';
              // make sure directory exists before copying file
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
              }
              fs.copyFileSync(`./data/${to_backup[i]}.json`, `./backups/${to_backup[i]}.json`);
              functions.update(allFunctions[x], { $set: { lastRun: new Date() } }, {}, function (err, numReplaced) {
              });
              console.log(`${to_backup[i]} backed up`);
            }
          }
        }
      }
    } catch (err) {
      console.log("In function runner", err);
      return err;
    }
  });
  const job = new SimpleIntervalJob(
    { seconds: 10, runImmediately: false },
    task, {
    id: 'id_2',
    preventOverrun: true
  });
  scheduler.addSimpleIntervalJob(job);
}

async function LoadUsers() {
  const db = Database.getInstance().getDataStore()?.['users'];


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
  // }); //logs are not auto loaded, they are loaded on demand
  const db = Database.getInstance().getDataStore()?.['logs'];
  // db.ensureIndex({ fieldName: "request_id", unique: true }, function (err) {
  // 	if (err) {
  // 		console.log(err);
  // 	}
  // });

  return db;
}

async function LoadFunctions() {
  if (!Database.getInstance().getDataStore().hasOwnProperty('functions')){
    const db=Database.getInstance().loadCollection('functions',{autoload:true, timestampData: true})
    return db;
  } else {
    const db = Database.getInstance().getDataStore()?.['functions']
    return db;
  }
}

async function LoadConfig() {

  const config=Database.getInstance().getDataStore()?.config
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
    application: {
      name: "Ezbase",
      url: "http://localhost:3690",
    },
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
      {
        name: "functions",
        type: CollectionType.user,
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
