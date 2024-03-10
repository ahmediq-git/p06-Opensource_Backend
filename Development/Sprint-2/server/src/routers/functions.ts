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
        let obj = { id: allFunctions[i]._id, data: "" }
        if (allFunctions[i].op == "export") {
            obj["data"] = `Export ${allFunctions[i].toExport} to ${allFunctions[i].outName}.txt every ${allFunctions[i].runAfter} seconds`;
        }
        else if (allFunctions[i].op == "backup") {
            obj["data"] = `Backup ${allFunctions[i].toBackup} every ${allFunctions[i].runAfter} seconds`;
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