import ValidationUtils from "../validators/validators.js";
import axios, { AxiosResponse } from "axios";

interface ListRecordsOptions {
    sort: {
        [key: string]: number;
    };
    limit: number;
    offset: number;
}

interface UpdateOptions {
    multi: boolean;
    upsert: boolean;
    returnUpdatedDocs: boolean;
}

class Crud {
    private client: any;
    private authStore: any;

    constructor(ezBaseClient: any, authStore: any) {
        this.client = ezBaseClient; //passing the client object to send to the user.
        this.authStore = authStore; //passing the authStore object to send to the user.
    }

    // creates a new collection with the given name
    async createCollection(collectionName: string): Promise<any> {
        try {
            // validate collection name
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for creation.")
            }

            const sendObject = { "collection_name": collectionName }
            const apiEndpoint = "/api/collections/create";
            const response = await this.client.sendToBackend(sendObject, apiEndpoint, "POST");
            if (response.status === 200) {
                // Extract data and error from response
                const { data, error } = response;
                // Check if there's an error
                if (error != null) {
                    console.error("An error occurred while creating collection: ", error);
                } else {
                    // check if the returned response includes an error
                    if (data.error != null) {
                        console.error("An error occurred while creating collection: ", data.error);
                    }
                    // Return data
                    return response;
                }
            }
            else {
                // Server returned an error status code
                console.error("An error occurred while creating collection: ", response.error);
            }
        } catch (error) {
            console.error("An error occurred while creating collection: ", error)
        }
    }

    // Gets name of all existing collections
    async getAllCollections(): Promise<string[] | void> {
        try {
            const apiEndpoint = "/api/collections";
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");

            return response;


        }
        catch (error) {
            throw error
        }
    }

    //deletes a collection with the given name
    async deleteCollection(collectionName: string): Promise<any> {
        try {
            if (!ValidationUtils.isString(collectionName)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }
            const apiEndpoint = `/api/collections/${collectionName}`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "DELETE");
            // console.log(response)
            if (response.status === 200) {
                // Extract data and error from response
                const { data, error } = response;

                // Check if there's an error
                if (error != null) {
                    console.error("An error occurred while deleting collection:", error);
                } else {
                    // check if the returned response includes an error
                    if (data.error != null) {
                        console.error("An error occurred while deleting collection:", data.error);
                    }
                    // Return data in case of success
                    return response;
                }
            }
            else {
                // Server returned an error status code
                console.error("An error occurred while deleting collection:", response.error);
            }

        } catch (error) {
            console.error("An error occurred while deleting collection: ", error)
            throw error
        }
    }

    // creates a new record in a collection
    async createRecord(collection_name: string, record: object): Promise<any> {
        try {
            if (!ValidationUtils.isString(collection_name)) {
                throw new Error("Invalid collection name. Please provide a valid collection name for deletion.")
            }

            if (!ValidationUtils.isObject(record)) {
                throw new Error(record + " is not a document")
            }

            const sendObject = { "collection_name": collection_name, "query": record };
            const apiEndpoint = "/api/record/create";
            const response = await this.client.sendToBackend(sendObject, apiEndpoint, "POST");

            if (response.status === 200) {
                // Extract data and error from response
                const { data, error } = response;

                // Check if there's an error
                if (error != null) {
                    console.error("An error occurred while creating record: ", error);
                    return "Error creating record";
                } else {
                    // check if the returned response includes an error
                    if (data.error != null) {
                        console.error("An error occurred while creating record: ", data.error);
                    }
                    // Return data
                    return response;
                }
            }
            else {
                // Server returned an error status code
                console.error("An error occurred while creating record: ", response.error);
            }
        } catch (error) {
            console.error("An error occurred while creating record: ", error)
            throw error
        }
    }

    async readRecord(collection_name: string, query: object = {}, embed: boolean = false): Promise<any> {
        try {
            if (!ValidationUtils.isString(collection_name)) {
                throw new Error(collection_name + " is not a valid collection name. Please provide a valid collection name for reading record.")
            }

            if (!ValidationUtils.isObject(query)) {
                throw new Error(query + " is not a string query. Please provide a valid query for reading record.")
            }

            let queryStr = JSON.stringify(query);

            // The api endpoint will include the query
            // For example, /api/record/read?collection_name=PMTestCollection1&query={"name": "John", "age": 23}

            let apiEndpoint = `/api/record/read?collection_name=${collection_name}&query=${queryStr}&embed=${embed}`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");

            if (response.status === 200) {
                // Extract data and error from response
                const { data, error } = response;

                // Check if there's an error
                if (error != null) {
                    console.error("An error occurred while reading record: ", error);
                } else {
                    // check if the returned response includes an error
                    if (data.error != null) {
                        console.error("An error occurred while reading record: ", data.error);
                    }
                    // Return data
                    return response;
                }
            }
            else {
                // Server returned an error status code
                console.error("An error occurred while reading record: ", response.error);
                return response;
            }
        } catch (error) {
            console.error("An error occurred while reading record: ", error)
            throw error;
        }
    }

    // deletes a record from a collection
    // queryOptions: only one option for now, 'multi' which allows the removal of multiple documents if set to true.
    // Default is false
    async deleteRecord(collection_name: string, query: object, queryOptions: boolean = false): Promise<any> {
        try {
            if (!ValidationUtils.isString(collection_name)) {
                throw new Error(collection_name + " is not a valid collection name. Please provide a valid collection name for deleting record.")
            }

            if (!ValidationUtils.isObject(query)) {
                throw new Error(query + " is not a string query. Please provide a valid query for deleting record.")
            }

            if (!ValidationUtils.isBoolean(queryOptions)) {
                throw new Error(queryOptions + " is not a boolean. Please provide a valid queryOptions for deleting record.")
            }

            let sendObject = { "collection_name": collection_name, "query": query, "queryOptions": queryOptions };

            const response = await this.client.sendToBackend(sendObject, "/api/record/delete", "DELETE");

            if (response.status === 200) {
                // Extract data and error from response
                const { data, error } = response;

                // Check if there's an error
                if (error != null) {
                    console.error("An error occurred while deleting record: ", error);
                } else {
                    // check if the returned response includes an error
                    if (data.error != null) {
                        console.error("An error occurred while deleting record: ", data.error);
                    }
                    // Return data
                    return response;
                }
            }
            else {
                // Server returned an error status code
                console.error("An error occurred while deleting record: ", response.error);
                return response
            }
        } catch (error) {
            console.error("An error occurred while deleting record: ", error)
            throw error
        }
    }



    // list the records in a collection
    async listRecords(collection_name: string, query: object, queryOptions: ListRecordsOptions, embed: boolean = false): Promise<any> {
        try {
            if (!ValidationUtils.isString(collection_name)) {
                throw new Error(collection_name + " is not a valid collection name. Please provide a valid collection name for listing records.")
            }

            if (!ValidationUtils.isObject(query)) {
                throw new Error(query + " is not a string query. Please provide a valid query for listing records.")
            }

            if (!ValidationUtils.isObject(queryOptions)) {
                throw new Error(queryOptions + " is not a string. Please provide a valid queryOptions for listing records.")
            }

            let queryStr = JSON.stringify(query);
            let queryOptionsStr = JSON.stringify(queryOptions);

            // The api endpoint will include the query
            // For example, /api/record/list?collection_name=PMTestCollection1&query={"name": "John", "age": 23}

            let apiEndpoint = `/api/record/list?collection_name=${collection_name}&query=${queryStr}&queryOptions=${queryOptionsStr}&embed=${embed}`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");

            if (response.status === 200) {
                // Extract data and error from response
                const { data, error } = response;

                // Check if there's an error
                if (error != null) {
                    console.error("An error occurred while listing records: ", error);
                } else {
                    // check if the returned response includes an error
                    if (data.error != null) {
                        console.error("An error occurred while listing collection: ", data.error);
                    }
                    // Return data
                    return response;
                }
            }

        } catch (error) {
            console.error("An error occurred while listing collection: ", error)
            throw error
        }
    }

    // counts the number of records in a collection
    async countRecords(collection_name: string, query: object): Promise<any> {
        try {
            if (!ValidationUtils.isString(collection_name)) {
                throw new Error(collection_name + " is not a valid collection name. Please provide a valid collection name for counting records.")
            }

            if (!ValidationUtils.isObject(query)) {
                throw new Error(query + " is not a string query. Please provide a valid query for counting records.")
            }

            let queryStr = JSON.stringify(query);

            // The api endpoint will include the query
            let apiEndpoint = `/api/record/count?collection_name=${collection_name}&query=${queryStr}`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");

            return response;

        } catch (error) {
            console.error("An error occurred while counting records: ", error)
            throw error
        }
    }


    async updateRecord(collection_name: string, query: object, new_record: object, options: object = {}): Promise<any> {
        try {

            const sendObject = { "collection_name": collection_name, query, new_record, options };
            const apiEndpoint = "/api/record/sdk-update";
            const response = await this.client.sendToBackend(sendObject, apiEndpoint, "PATCH");

            return response;

        } catch (error) {

            throw error;
        }
    }


}

export default Crud;