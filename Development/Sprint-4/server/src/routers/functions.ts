import { ListRecordsOptions, createRecord, listRecords } from "@src/controllers/record-crud";
import Database from "@src/database/database_handler";
import { QueryOptions } from "@src/utils/record-crud/generateQuery";
import { Hono } from "hono";
import DataStore, { on } from "nedb";

const functions = new Hono();

functions.post('register_function', async (c) => {
    const { new_function } = await c.req.json();
    try {
        const record = await createRecord(new_function, 'functions');
        return c.json({
            data: record,
            error: null,
        });
    } catch (err) {
        return c.json({
            data: null,
            error: "Failed to register function",
        });
    }
})

functions.get('registered_functions', async (c) => {
    let queryOptions: ListRecordsOptions = {
        sort: {},
        limit: 0,
        offset: 0
    };
    const functions_datastore = Database.getInstance().getDataStore()["functions"];
    const allFunctions: any[] = await new Promise((resolve, reject) => {
        functions_datastore.find({}, function (err: any, docs: any) {
            if (err) {
                reject(err);
            }
            resolve(docs);
        });
    });
    let to_ret = [];
    for (let i = 0; i < allFunctions.length; i++) {
        let obj = { id: allFunctions[i]._id, data: "", function_log: "" }
        
        // Extracting date and time
        const updatedAtString = allFunctions[i]?.updatedAt?.toISOString();
        let time;
        if (updatedAtString) {
            const dateObj = new Date(updatedAtString);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            const seconds = dateObj.getSeconds().toString().padStart(2, '0');
            time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } else {
            time = 'Unspecified';
        }

        if (allFunctions[i].op == "export") {
            obj["data"] = `Export ${allFunctions[i].toExport} to ${allFunctions[i].outName}.txt every ${allFunctions[i].runAfter} seconds`;
            obj['function_log'] = `${time}: Export ${allFunctions[i].toExport} to ${allFunctions[i].outName}.txt has occured`;
        }
        else if (allFunctions[i].op == "backup") {
            obj["data"] = `Backup ${allFunctions[i].toBackup} every ${allFunctions[i].runAfter} seconds`;
            obj['function_log'] = `${time}: Backup ${allFunctions[i].toBackup} to ${allFunctions[i].outName}.txt has occured`;
        }

        to_ret.push(obj);
    }
    return c.json({
        data: to_ret,
        error: null
    })
})

functions.delete('delete_function', async (c) => {
    const { id } = await c.req.json();
    const functions_datastore = Database.getInstance().getDataStore()["functions"];
    functions_datastore.remove({ _id: id }, {}, function (err, numRemoved) {
        if (err) {
            console.log(err);
            return c.json({
                data: null,
                error: "Failed to delete function",
            });
        } else {
            functions_datastore.persistence.compactDatafile();
            return c.json({
                data: null,
                error: null,
            });
        }
    });
})

export default functions;