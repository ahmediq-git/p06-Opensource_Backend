import { createRecord } from "@src/controllers/record-crud";
import { Hono } from "hono";


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

export default functions;