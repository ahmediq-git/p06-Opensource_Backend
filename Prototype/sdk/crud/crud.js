class Crud {
    constructor() {
        console.log("Crud class");
    }

    createCollection(collectionName) {
        //creates a collection with the given name
    }

    deleteCollection(collectionId) {
        //deletes a collection with the given Id
    }

    addRecord(collectionName, record) { // Faraz
        //adds record to the given collection
    }

    deleteRecord(collectionName, recordId) { // Faraz
        //deletes entire record from the given collection
    }

    updateRecord(collectionName, recordId, newRecord) { // Faraz
        //updates fields record in the given collection
        // all the fields in the record will be updated with fields of current record
    }

    replaceRecord(collectionName, recordId, newRecord) { // Faraz
        //replaces the entire current record with the new record in the given collection
    }

    getRecord(collectionName, recordId) {
        //returns the record from the given collection
    }

    getCollectionId(collectionName) {
        //returns the collection with the given name
    }


    getAllRecords(collectionName) {
        //returns all the records from the given collection
    }

    find(collectionName, query, matches = -1) { // Faraz
        //returns all the records from the given collection
        //query is the search criteria, matches is the number of records to be returned
        // if matches is -1, all records are returned, else the exact number of matches of records is returned

        // it returns 2 objects. The first is the object containing all records,
        // the second is the object containing all record Ids
    }
}

export default Crud;

// Basic Operations:
// 1) Validate
// 2) JSON packaging