class Crud {
    constructor(ezBaseClient) {
        this.client = ezBaseClient; //passing the client object to send to the user.
    }

    // Validator functions

    #isObject(userInput) {
        return typeof userInput === 'object' && Input !== null && !Array.isArray(input);
    }

    // checks whether the object is of single key value pair like {field: value1}
    #isSingleKeyValuePair(obj) {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length === 1;
    }

    #isString(userInput) {
        return typeof userInput === 'string';
    }

    //creates a collection with the given name
    async createCollection(collectionName) {
        try {
            if (!this.#isString(collectionName)) {
                throw new Error("Invalid collection name, please provide a valid collection name for creation.")
            }

            const sendObject = { "collection_name": collectionName }

            this.client.sendToBackend(sendObject, "/create_collection", "POST")
        } catch (error) {
            console.log("Error creating collection: ", error)
        }
    }

    //deletes a collection with the given name
    async deleteCollection(collectionName) {
        try {
            if (!this.#isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            const sendObject = { "collection_name": collectionName, "delete_all_data": true }
            this.client.sendToBackend(sendObject, "/delete_collection", "DELETE")

        } catch (error) {
            console.log("Error deleting collection: ", error)
        }
    }

    // Inserts a document in a collection, returns the document Id of the given Document
    async insertDoc(collectionName, doc) { 

    }

    // Deletes a document from a collection
    async deleteDoc(collectionName, docId) { //Faraz

    }

    // inserts a single new field into specific document within a collection
    // newField is a key value pair
    async insertField(collectionName, docId, newField) { //Faraz
        // use isSingleKeyValuePair here
    }

    //  inserts many new fields to a specified document within a collection
    // newFields is an object like {"key1": "value1", "key2": "value2",....}
    async insertManyFields(collectionName, docId, newFields){

    }

    // updates the given fields in a document in a collection
    // all the fields in the record will be updated with fields of current record
    async updateDoc(collectionName, docId, newRecord) { // Faraz

    }

    //returns a single document from the given collection
    async getDoc(collectionName, docId) {
        try {
            if (!this.#isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            if (!this.#isString(docId)) { //TODO: Should have a check for the id
                throw new Error("Invalid document id. Please provide a valid record id for deletion.")
            }

            const sendObject = { "collection_name": collectionName, "doc_id": docId }

            // TODO: If there is error then response handling
            response = this.client.sendToBackend(sendObject, "/get_doc", "GET")
            return response;

        }
        catch(error){
            console.log("Error getting record: ", error)
        }
    }

    //returns all the documents from the given collection
    async getAllDocs(collectionName) {
        try {
            if (!this.#isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            const sendObject = { "collection_name": collectionName }

            // TODO: If there is error then response handling
            response = this.client.sendToBackend(sendObject, "/get_all_docs", "GET")
            return response;

        }
        catch(error){
            console.log("Error getting Collection: ", error)
        }
    }

    //returns all the records from the given collection
    //query is the search criteria, matches is the number of records to be returned
    // if matches is -1, all records are returned, else the exact number of matches of records is returned

    // it returns 2 objects. The first is the object containing all records,
    // the second is the object containing all record Ids
    async findDoc(collectionName, query, matches = -1) { //Faraz

    }




}

export default Crud;


// structure of collection documents and fields

// collection: doc_id1 {
//                     
//                     field1: value1,
//                     field2: value2,
//                 }
//
//             doc_id2 {
//                     
//                     field1: value1,
//                     field2: value2,
//                 }