import { ListRecordsOptions, createRecord, listRecords } from "@src/controllers/record-crud";
import Database from "@src/database/database_handler";
import { QueryOptions } from "@src/utils/record-crud/generateQuery";
import { Hono } from "hono";
import DataStore, { on } from "nedb";

const stress = new Hono();

stress.post('stress_test', async (c) => {
    const { obj } = await c.req.json();
    try {
        await createRecord(obj, 'stress');
        return c.json({
            data: null,
            error: null,
        });
    } catch (err) {
        return c.json({
            data: null,
            error: "Failed to register function",
        });
    }
})


export default stress;