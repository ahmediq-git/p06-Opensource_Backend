import { Context, Hono } from "hono";
import {fetchRules} from "../utils/rules/fetchRules"
import {updateRules} from "../utils/rules/updateRules"
import { checkPermissions } from "@src/utils/rules/checkPermissions";
import { constructRulesMemoryObject } from "@src/utils/rules/constructRulesMemoryObject";
import { updateRecord } from "@src/controllers/record-crud";
import { getCollection } from "@src/utils/getCollection";

const rules = new Hono();

// should return all the rules from the database
rules.get("/get_rules", async (c: Context) => {
    try{
        const getRules = await fetchRules()
       
        if (!getRules) throw Error("Error: rules do not exist")

        return c.json({error: null, data: getRules})

    } catch(error: any) {
        const statusCode = error.isOperational ? 401: 500;
        const message = error.isOperational ? error.message: "Internal server Error";
        
        return c.json({error: message, data:null}, statusCode);
    }
})


// updates rules in database AND processes and computes the rules to be in memory
rules.post("/update_rules", async (c: Context)=>{
    try {
        const rules = await c.req.json();

        if (!rules) throw new Error("Invalid Rules provided")

        const info = await updateRules(rules)
        
        const user_rules_db = getCollection('user_rules')
		const user_db = getCollection('users')

		const user_rules_promise = new Promise<any[]>((resolve, reject) => {
			user_rules_db.find({}, (err: any, doc: any) => {
				if (err) {
					reject(err);
				} else {
					resolve(doc)
		
				}
			});
		});

		const users_promise = new Promise<any[]>((resolve, reject) => {
			user_db.find({}, (err: any, doc: any) => {
				if (err) {
					reject(err);
				} else {

					resolve(doc)
				}
			});
		});
	

		const user_rules = await user_rules_promise;
		const users  = await users_promise;


		const updated_rules = await fetchRules()

		for (let i = 0; i < user_rules.length; i++) {
			
			let cur_user_email = user_rules[i].email;
			let cur_user_id = user_rules[i]._id		
			
			
			for (let j=0; j < users.length; j++){

				if (users[j].email == cur_user_email){
					const cur_user_metadata=users[j].user_metadata

					const recomputed_rules = {email: cur_user_email, permission: constructRulesMemoryObject(cur_user_metadata, updated_rules.userRules, updated_rules.defaultRuleObject)}
					await updateRecord('user_rules', cur_user_id, recomputed_rules)
				
				}

			}
		}

        return c.json({
            error: null, 
            data: "Updated Rules successfully"
        })
   } catch(error: any) {
        const statusCode = error.isOperational ? 401: 500;
        const message = error.isOperational ? error.message: "Internal server Error";
        
        return c.json({error: message, data:null}, statusCode);
   }
})


export default rules;