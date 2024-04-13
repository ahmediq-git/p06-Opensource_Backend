import { Context, Hono } from "hono";
import {fetchRules} from "../utils/rules/fetchRules"
import {updateRules} from "../utils/rules/updateRules"
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