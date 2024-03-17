import getAllCollections from "@src/utils/collection-crud/getAllCollections";
import { Hono } from "hono";
import collections from "./collection-crud";
import { listRecords } from "@src/controllers/record-crud";

const schema = new Hono();

schema.get('/get_schema', async (c) => {
    try {
        const all_collections = await getAllCollections();
        let schemaPromises = all_collections.map(async (current_col) => {
            let schema:any = {
                'concrete': [],
                'loose': []
            };
            let all_records: any = await listRecords({}, {
                'sort': { ['createdAt']: 0 },
                limit: 0,
                offset: 0
            }, current_col);
            let keyInfo:any = {};
            let foreignKeyInfo:any = {};

            for (let j = 0; j < all_records.length; j++) {
                const record = all_records[j];
                for (let key in record) {
                    if (record[key] != null && record[key] != undefined && typeof record[key] === 'object' && 'type' in record[key] && record[key]['type'] == 'foreign_key') {
                        let ref = record[key]['collection'];
                        if (ref == undefined || ref == null) {
                            continue;
                        }
                        let key_with_ref = `${key} ---> ${ref}`
                        if (foreignKeyInfo[key_with_ref]) {
                            foreignKeyInfo[key_with_ref].count++;
                        } else {
                            foreignKeyInfo[key_with_ref] = { count: 1, ref };
                        }
                    } else {
                        let type = typeof key;
                        let key_with_type = `${key} : ${type}`
                        if (keyInfo[key_with_type]) {
                            keyInfo[key_with_type].count++;
                        } else {
                            keyInfo[key_with_type] = { count: 1, type };
                        }
                    }

                }

            }
            for (let key in keyInfo) {
                if (keyInfo[key].count == all_records.length) {
                    schema['concrete'].push(key);
                } else {
                    schema['loose'].push(key)
                }
            }
            for (let key in foreignKeyInfo) {
                if (foreignKeyInfo[key].count == all_records.length) {
                    schema['concrete'].push(key);
                } else {
                    schema['loose'].push(key)
                }
            }
            return [current_col, schema];
        });

        let schemas = await Promise.all(schemaPromises);
        return c.json({
            data: schemas,
            error: null
        });
    } catch (error) {
        return c.json({
            data: null,
            error: 'Error generating schema'
        });
    }
})
function generateMarkdownTable(schemas: any[][]) {
    let markdown = "";
    schemas.forEach(([schemaName, schemaData]) => {
        markdown += `## ${schemaName}\n\n`;

        if (schemaData.concrete.length > 0) {
            markdown += "| Concrete |\n";
            markdown += "|----------|-------|\n";
            markdown += "| field     | type  |\n";
            markdown += "|----------|-------|\n";
            schemaData.concrete.forEach((item: { split: (arg0: string) => [any, any]; }) => {
                const [name, type] = item.split(" ");
                markdown += `| ${name} | ${type} |\n`;
            });
            markdown += "\n";
        }

        if (schemaData.loose.length > 0) {
            markdown += "| Loose |\n";
            markdown += "|-------|\n";
            const hasRefers = schemaData.loose.some((item: string | string[]) => item.includes("refers"));
            if (hasRefers) {
                markdown += "| field  | reference |\n";
                markdown += "|--------|-----------|\n";
            } else {
                markdown += "| name   |\n";
                markdown += "|-------|\n";
            }
            schemaData.loose.forEach((item: { includes: (arg0: string) => any; split: (arg0: string) => [any, any]; }) => {
                if (item.includes("refers")) {
                    const [field, reference] = item.split(" refers ");
                    let coll = reference.split("collection")[1]
                    markdown += `| ${field} | ${coll} |\n`;
                } else {
                    markdown += `| ${item} |\n`;
                }
            });
            markdown += "\n";
        }
    });
    return markdown;
}

export default schema;
