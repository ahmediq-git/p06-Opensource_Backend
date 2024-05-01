import {Hono, Context} from "hono";
import { readRecord } from "@src/controllers/record-crud";
import { checkPermissions } from "../utils/rules/checkPermissions";
import { fetchRules } from "@src/utils/rules/fetchRules";

export const checkApiPermissions= async (c: Context, next: () => Promise<void>) => {
    try {
        if (c.get('user')?.role === 'admin' || (c.get('Authorization')==='Guest' && c.req.url.includes('/api/auth/admin'))) {
            // console.log("Admin Authorized for any action")
        } else if (c.get('Authorization')==='Guest') {
            const rules = await fetchRules()

            // deleteCollection permissions
            if (c.req.url.includes('/api/collection/') && c.req.method =='DELETE'){
                const { collection_name } = c.req.param();
                const obj = await c.req.json()

                const decision = rules.defaultRuleObject[collection_name]['deleteRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }

            } else if (c.req.url.includes('/api/record/create')){
                // create record permissions
                const obj = await c.req.json()

                const decision = rules.defaultRuleObject[obj.collection_name]['createRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            } else if (c.req.url.includes('/api/record/list?collection_name=')){
                // read record permissions
                const collection_name = c.req.query().collection_name

                const decision = rules.defaultRuleObject[collection_name]['readRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            } else if (c.req.url.includes('/api/record/update')) {
                // Update record's permissions
                const obj = await c.req.json()
            
                const decision = rules.defaultRuleObject[obj.collection_name]['updateRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }

            } else if (c.req.url.includes('/api/record/delete')) {
            //     //  delete record permissions
                const obj = await c.req.json()
            
                const decision = rules.defaultRuleObject[obj.collection_name]['deleteRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            }
        
            
        } else if (c.get('Authorization') == 'User') {
            // get the email, the collection, the action, run and decide
            const email = c.get('user').email
            
            const user_rule = await readRecord({email:email}, 'user_rules' )

            const permissions = user_rule[0]['permission']
        

            if (c.req.url.includes('/api/collection/') && c.req.method =='DELETE'){
                const { collection_name } = c.req.param();
                const obj = await c.req.json()

                const decision = permissions[collection_name]['deleteRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }

            } else if (c.req.url.includes('/api/record/create')){
                // create record permissions
                const obj = await c.req.json()

                const decision = permissions[obj.collection_name]['createRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            } else if (c.req.url.includes('/api/record/list?collection_name=')){
                // read record permissions
                const collection_name = c.req.query().collection_name

                const decision = permissions[collection_name]['readRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            } else if (c.req.url.includes('/api/record/update')) {
                // Update record's permissions
                const obj = await c.req.json()
            
                const decision = permissions[obj.collection_name]['updateRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }

            } else if (c.req.url.includes('/api/record/delete')) {
            //     //  delete record permissions
                const obj = await c.req.json()
        
                const decision = permissions[obj.collection_name]['deleteRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            }
        }
    } catch (error){
        console.log(error)
        try {
            const rules = await fetchRules()

            // deleteCollection permissions
            if (c.req.url.includes('/api/collection/') && c.req.method =='DELETE'){
                const { collection_name } = c.req.param();
                const obj = await c.req.json()

                const decision = rules.defaultRuleObject[collection_name]['deleteRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }

            } else if (c.req.url.includes('/api/record/create')){
                // create record permissions
                const obj = await c.req.json()

                const decision = rules.defaultRuleObject[obj.collection_name]['createRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            } else if (c.req.url.includes('/api/record/list?collection_name=')){
                // read record permissions
                const collection_name = c.req.query().collection_name

                const decision = rules.defaultRuleObject[collection_name]['readRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            } else if (c.req.url.includes('/api/record/update')) {
                // Update record's permissions
                const obj = await c.req.json()
            
                const decision = rules.defaultRuleObject[obj.collection_name]['updateRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }

            } else if (c.req.url.includes('/api/record/delete')) {
            //     //  delete record permissions
                const obj = await c.req.json()
            
                const decision = rules.defaultRuleObject[obj.collection_name]['deleteRecord']

                if (!decision) {
                    return c.json({
                        data: null,
                        error: "Failed to get Records, Insufficient permissions",
                    });
                }
            }
        } catch (error) {
            return c.json({
                data: null,
                error: "Internal Server Error",
            });
        }
    }

    return await next()
}