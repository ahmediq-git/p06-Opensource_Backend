import Datastore from 'nedb';
import * as jose from jose;

export default async function createAdmin() {
    const db = new Datastore({ filename: './data/config.json', autoload: true });

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
