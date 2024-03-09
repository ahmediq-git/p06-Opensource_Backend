import Datastore from 'nedb';
import * as jose from jose;
import Database from '@src/database/database_handler';

export default async function createAdmin() {
    const db = Database.getInstance().getDataStore()['config']
    
    // new Datastore({ filename: './data/config.json', autoload: true });

    // get config
    const config = await new Promise((resolve, reject) => {
        db.findOne({ type: 'config' }, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    }
    );

    
    // create admin

    return config;
}
