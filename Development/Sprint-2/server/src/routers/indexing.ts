import getAllCollections from "@src/utils/collection-crud/getAllCollections";
import { Hono } from "hono";
import collections from "./collection-crud";
import { listRecords, readRecord } from "@src/controllers/record-crud";
import Database from "@src/database/database_handler";

const index = new Hono();

index.get('/get_all_indices', async (c) => {
    let all_indices: any = await listRecords({}, {
        'sort': { ['createdAt']: 0 },
        limit: 0,
        offset: 0
    }, 'indices');
    return c.json({
        data: all_indices,
        error: null
    })
})

index.get('/get_all_indices_of_collection', async (c) => {
    const { collection_name } = await c.req.query();
    const db = Database.getInstance().getDataStore()?.['indices'];
    const all_indices: any = await new Promise((resolve, reject) => {
        db.find({
            'collection': collection_name,
        }, function (err: Error | null, docs: any) {
            if (err) {
                reject(err);
            }
            resolve(docs);
        });
    });
    return c.json({
        data: all_indices,
        error: null
    })
})

index.post('/create_index', async (c) => {
    const { collection_name, field, unique } = await c.req.json();
    const db = Database.getInstance().getDataStore()?.['indices'];
    const docs: any = await new Promise((resolve, reject) => {
        db.find({
            'collection': collection_name,
            'on': field,
            'unique': unique
        }, function (err: Error | null, docs: any) {
            if (err) {
                reject(err);
            }
            resolve(docs);
        });
    });
    if (docs.length > 0) {
        return c.json({
            data: null,
            error: 'Index already exists'
        })
    } else {
        const coll = Database.getInstance().getDataStore()?.[collection_name];
        coll.ensureIndex({ fieldName: field, unique: unique }, function (err) {
            console.log(err);
        });
        db.insert({ "collection": collection_name, "on": field, "unique": unique }, () => { });
        return c.json({
            data: 'Index created successfully',
            error: null
        })
    }
})

index.delete('/remove_index', async (c) => {
    const { collection_name, field } = await c.req.json();
    const db = Database.getInstance().getDataStore()?.['indices'];
    const docs: any = await new Promise((resolve, reject) => {
        db.find({
            'collection': collection_name,
            'on': field,
        }, function (err: Error | null, docs: any) {
            if (err) {
                reject(err);
            }
            resolve(docs);
        });
    });
    if (docs.length <= 0) {
        return c.json({
            data: null,
            error: 'Index does not exist'
        })
    } else {
        const coll = Database.getInstance().getDataStore()?.[collection_name];
        coll.removeIndex(field, function (err) {
            console.log(err);
        })
        db.remove({ "collection": collection_name, "on": field }, () => { });
        return c.json({
            data: 'Index removed',
            error: null
        })
    }
})


export default index;
