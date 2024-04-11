import { Context, Hono } from "hono";
import { getCollection } from "@utils/getCollection";

const admin_ui = new Hono();

admin_ui.get("/settings", async (c: Context) => {
    try {
        const config = getCollection("config");
        const settings = await new Promise((resolve, reject) => {
            config.findOne({}, function (err, docs) {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });

        return c.json({
            data: settings,
            error: null,
        });
    } catch (err) {
        return c.json({
            data: null,
            error: err
        });
    }
});

admin_ui.get("/settings/:setting_name", async (c: Context) => {
    try {
        const { setting_name } = c.req.param();
        const config = getCollection("config");
        const settings: { [key: string]: any } = await new Promise((resolve, reject) => {
            config.findOne({}, function (err, docs) {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });

        if (!settings) throw new Error("Failed to get settings");
        const setting = settings.hasOwnProperty(setting_name) ? settings[setting_name] : false;

        if (!setting) throw new Error("Failed to get setting");

        return c.json({
            data: setting,
            error: null,
        });
    } catch (err) {
        return c.json({
            data: null,
            error: err,
        })
    }
});

admin_ui.put("/settings", async (c: Context) => {
    try {
        const { setting_name, value } = await c.req.json();
        const config = getCollection("config");
        const settings: any = await new Promise((resolve, reject) => {
            config.findOne({}, function (err, docs) {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });

        if (!settings) throw new Error("Failed to get settings");

        const setting = settings.hasOwnProperty(setting_name) ? true : false;
        if (!setting) throw new Error("Failed to get setting");
        settings[setting_name] = value;
        config.update({
            _id: settings._id
        }, settings, {}, function (err, numReplaced) {
            if (err) {
                console.log(err);
                throw new Error("Failed to update settings");
            }
        });

        config.persistence.compactDatafile();

        return c.json({
            data: "Settings updated",
            error: null,
        });


    } catch (err) {
        return c.json({
            data: null,
            error: err,
        });
    }
});

export default admin_ui;