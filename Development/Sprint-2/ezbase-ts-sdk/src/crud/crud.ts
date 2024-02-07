import ValidationUtils from "../validators/validators.js";

class Crud {
    private client: any;
    private authStore: any;

    constructor(ezBaseClient: any, authStore: any) {
        this.client = ezBaseClient; //passing the client object to send to the user.
        this.authStore = authStore; //passing the authStore object to send to the user.
    }

    // creates a collection with the given name
    // if the collection already exists, then the collection remains as is unchanged
    async createCollection(collectionName: string): Promise<any> {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name, please provide a valid collection name for creation.")
            }

            const sendObject = { "collection_name": collectionName }

            const res = await this.client.sendToBackend(sendObject, "/api/collections/create", "POST")
            return res;
        } catch (error) {
            console.log("Error creating collection: ", error)
            return "Error creating collection";
        }
    }

    //deletes a collection with the given name
    async deleteCollection(collectionName: string): Promise<any> {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            const sendObject = { "collection_name": collectionName, "delete_all_data": true }
            await this.client.sendToBackend(sendObject, "/delete_collection", "DELETE")

        } catch (error) {
            console.log("Error deleting collection: ", error)
        }
    }

    // Inserts a document of only one field: (one key and value) in a collection and returns the index of the inserted document
    async insertSingleFieldDoc(collectionName: string, doc: Record<string, any>): Promise<any> {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            if (!ValidationUtils.isObject(doc)) {
                throw new Error(doc + " is not a document")
            }

            const keys = Object.keys(doc);
            const key = keys[0];
            const value = doc[key];

            const sendObject = { "collection_name": collectionName, "field_name": key, "field_value": value };
            const response = await this.client.sendToBackend(sendObject, "/insert_doc", "POST");
            return response.data

        } catch (error) {
            console.log("Error inserting document: ", error)
        }
    }

    // Inserts a document in a collection, (of many fields)  and returns the id
    async insertDoc(collectionName: string, doc: object): Promise<any> {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            if (!ValidationUtils.isObject(doc)) {
                throw new Error(doc + " is not a document")
            }


            const sendObject = { "collection_name": collectionName, "data": doc };
            const response = await this.client.sendToBackend(sendObject, "/insert_doc_multifield", "POST");
            // returns the id of the doc
            return response.data
        } catch (error) {
            console.log("Error inserting document: ", error)
        }
    }

    // Inserts many documents in a collection and returns the id
    // returns array of IDs
    async insertManyDocs(collectionName: string, docs: object[]): Promise<any> {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            if (!ValidationUtils.isArrayOfObjects(docs)) {
                throw new Error(docs + " is not an array of documents")
            }

            const convertedDocs = ValidationUtils.objectFromArrayOfObjects(docs);

            const sendObject = { "collection_name": collectionName, "docs": convertedDocs };
            const response = await this.client.sendToBackend(sendObject, "/insert_docs", "POST");
            // returns the id of the doc
            return response.data
        } catch (error) {
            console.log("Error inserting documents: ", error)
        }

    }
    // Deletes a document from a collection
    async deleteDoc(collectionName: string, docId: string) {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            if (!ValidationUtils.isString(docId)) {
                throw new Error("Invalid document id. Please provide a valid record id for deletion.")
            }

            const sendObject = { "collection_name": collectionName, "doc_id": docId }
            await this.client.sendToBackend(sendObject, "/delete_doc", "DELETE");
        } catch (error) {
            console.log("Error deleting document: ", error)
        }
    }

    // inserts a single new field into specific document within a collection
    // newField is a key value pair
    async insertField(collectionName: string, docId: string, newField: Record<string, any>) {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            if (!ValidationUtils.isString(docId)) {
                throw new Error("Invalid document id. Please provide a valid record id for deletion.")
            }
            if (!ValidationUtils.isSingleKeyValuePair(newField)) {
                throw new Error("Invalid field. Please provide a valid field for insertion.")
            }

            const keys = Object.keys(newField);
            const key = keys[0];
            const value = newField[key];

            const sendObject = { "collection_name": collectionName, "doc_id": docId, "field_name": key, "field_value": value }
            await this.client.sendToBackend(sendObject, "/insert_field", "POST");
        } catch (error) {
            console.log("Error inserting field: ", error)
        }
    }

    //  inserts many new fields to a specified document within a collection
    // newFields is an object like {"key1": "value1", "key2": "value2",....}
    async insertManyFields(collectionName: string, docId: string, newFields: object) {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            if (!ValidationUtils.isString(docId)) {
                throw new Error("Invalid document id. Please provide a valid record id for deletion.")
            }
            if (!ValidationUtils.isObject(newFields)) {
                throw new Error("Invalid fields. Please provide valid fields for insertion.")
            }

            const sendObject = { "collection_name": collectionName, "doc_id": docId, "fields_to_insert": newFields }
            await this.client.sendToBackend(sendObject, "/insert_many_fields", "POST");
        } catch (error) {
            console.log("Error inserting fields: ", error)
        }
    }

    // updates the given fields in a document in a collection
    // all the fields in the record will be updated with fields of current record
    async updateDoc(collectionName: string, docId: string, newRecord: object) {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            if (!ValidationUtils.isString(docId)) {
                throw new Error("Invalid document id. Please provide a valid record id for deletion.")
            }
            if (!ValidationUtils.isObject(newRecord)) {
                throw new Error("Invalid record. Please provide a valid record for updation.")
            }

            const sendObject = { "collection_name": collectionName, "doc_id": docId, "fields_to_insert": newRecord }
            await this.client.sendToBackend(sendObject, "/insert_many_fields", "POST");
        } catch (error) {
            console.log("Error updating document: ", error)
        }
    }

    //returns a single document from the given collection
    async getDoc(collectionName: string, docId: string) {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            if (!ValidationUtils.isString(docId)) {
                throw new Error("Invalid document id. Please provide a valid record id for deletion.")
            }

            const sendObject = { "collection_name": collectionName, "doc_id": docId }

            const response = await this.client.sendToBackend(sendObject, "/get_doc", "GET")
            return response.data;

        }
        catch (error) {
            console.log("Error getting record: ", error)
        }
    }

    //returns all the documents from the given collection
    async getAllDocs(collectionName: string) {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            const sendObject = { "collection_name": collectionName }

            const response = await this.client.sendToBackend(sendObject, "/get_all_docs", "GET");
            return response.data;

        } catch (error) {
            console.log("Error getting Collection: ", error)
        }
    }


    // returns all the records from the given collection
    // query is the search criteria
    // it returns the exact doc if it exists to the user
    // query at the moment is a single key value pair like {key: value}
    async findDoc(collectionName: string, query: Record<string, any>): Promise<any> {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            if (!ValidationUtils.isSingleKeyValuePair(query)) {
                throw new Error("Invalid query, should be a single key value pair")
            }

            const keys = Object.keys(query);
            const key = keys[0];
            const value = query[key];

            const sendObject = { "collection_name": collectionName, "search_key": key, "search_value": value }
            const response = await this.client.sendToBackend(sendObject, "/search_doc", "POST")
            return response.data;

        } catch (error) {
            console.log("Error finding document: ", error)
        }
    }

    // // Gets name of all collections
    // async getCollectionNames(): Promise<string[] | []> {
    //     try {
    //         console.log("Getting collection names (sdk)")
    //         const response = await this.client.sendToBackend({}, "/api/collections", "GET")
    //         return response;
    //     }
    //     catch (error) {
    //         console.log("Error returning collection names: ", error)
    //         return []
    //     }
    // }

    // Gets name of all collections
    async getCollectionNames(): Promise<string[] | []> {
        try {
            console.log("Getting collection names (sdk)")
            const response = await this.client.sendToBackend({}, "/api/collections", "GET");

            // Check if response is ok
            if (response.ok) {
                // Parse JSON response
                const responseData = await response.json();
                // Extract data and error from response
                const { data, error } = responseData;

                // Check if there's an error
                if (error) {
                    console.error("An error occurred while getting collection names:", error);
                    return [];
                } else {
                    // Return collection names
                    return data;
                }
            } else {
                // Server returned an error status code
                console.error("Server returned an error while getting collection names:", response.statusText);
                return [];
            }
        }
        catch (error) {
            console.log("Error returning collection names: ", error);
            return [];
        }
    }



}

export default Crud;