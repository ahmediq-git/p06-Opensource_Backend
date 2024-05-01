import {getCollection} from "../getCollection"
import {updateRecord} from "../../controllers/record-crud"


// will fetch both default and userRules specification from database
export async function updateRules(newRules: any) {
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

        const doc_id=rules_obj._id

        return await updateRecord('rules', doc_id, newRules)
       
        // return rules_obj;
    } catch (error) {
        throw new Error("Failed to get rules");
    }
}
