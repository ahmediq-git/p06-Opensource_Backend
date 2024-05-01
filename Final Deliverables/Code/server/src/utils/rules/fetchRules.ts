import {getCollection} from "../getCollection"

// will fetch both default and userRules specification from database
export async function fetchRules() {
    try {
        const db = getCollection('rules');

        const rules = new Promise<any[]>((resolve, reject) => {
            db.find({}, (err: any, doc: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc[0]);
                }
            });
        });

        const rules_obj = await rules;
       
        return rules_obj;
    } catch (error) {
        throw new Error("Failed to get rules");
    }
}
