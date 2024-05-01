import Database from "../../../database/database_handler"

type blobStorage = {
    useBlobStorage: boolean;
    blobEndpoint: string;
    region: string;
    accountKey: string;
    storageConnectionString: string;
    sas: string;
}

export default async function getStorageAccountDetails(): Promise<any> {
    try {
        const config: any = Database.getInstance().getDataStore()?.config

        // new DataStore({
        // 	filename: "./data/config.json",
        // 	autoload: true,
        // 	timestampData: true,
        // });

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

        const blobStorage: blobStorage = appConfig.blobStorage;
        if (!blobStorage) throw new Error("No blobStorage configuration found");

        return blobStorage;

    } catch (err) {
        return err;
    }
}