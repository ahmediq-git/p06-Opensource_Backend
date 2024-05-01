import Database from "@src/database/database_handler";

export default async function getSettings(name: any) {
  const db = Database.getInstance().getDataStore()["config"];

  const config = new Promise<any[]>((resolve, reject) => {
    db.find({}, (err: any, doc: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(doc[0]);
      }
    });
  });

  const settings = await config;
  const setting = settings.hasOwnProperty(name) ? settings[name] : false;
  if (!setting) throw new Error("Failed to get setting");

  return setting
}
