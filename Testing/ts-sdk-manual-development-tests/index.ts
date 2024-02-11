import ezbase from 'ezbase-ts';
import axios, { AxiosResponse } from 'axios';

const eb = new ezbase("http://localhost:3690");

// 1) Test for createCollection()
async function createCollectionTest(): Promise<any> {
    console.log("");
    console.log("Testing creation of collections");
    const cct1 = await eb.db.createCollection("TestSDKCollection1");
    console.log(cct1);
}

// 2) Test for getCollectionsTest()
function getCollectionsTest(): void {
    console.log("Testing getting names of all Collections (should return all collection names)");
    eb.db.getAllCollections().then((ans: any) => console.log(ans));
}

//3) Test for insertSingleFieldDoc()
async function deleteCollection(): Promise<void> {
    try {
        console.log("Testing deletion of a collection");
        const response = await eb.db.deleteCollection("TestSDKCollection1");
        console.log("Response received for deleteCollection: ", response);
    }
    catch (err) {
        console.log("Error received for deleteCollection: ", err);
    }
}

// 4) Test for createRecord`
function createRecord(): void {
    console.log("Testing insertion of a single field document");
    eb.db.createRecord("TestSDKCollection1", { "name": "John Doe" }).then((ans: any) => console.log(ans));
}

// 5) Test for readRecord()
function readRecord(): void {
    console.log("Testing reading a single field document");
    eb.db.readRecord("TestSDKCollection1", { "name": "John Doe" }).then((ans: any) => console.log(ans));
}

// 6) Test for deleteRecord()
async function deleteRecord(): Promise<void> {
    console.log("Testing deletion of a single field document");
    const result = await eb.db.deleteRecord("TestSDKCollection1", { "name": "John Doe" }, true).then((ans: any) => console.log(ans));
}

// 7) Test for listRecords()
function listRecords(): void {
    console.log("Testing listing of all documents in a collection");
    eb.db.listRecords("TestSDKCollection1", {}, {}).then((ans: any) => console.log(ans));
}

// 8) Test for countRecords()
function countRecords(): void {
    console.log("Testing counting of all documents in a collection");
    eb.db.countRecords("TestSDKCollection1", { "name": "John Doe" }).then((ans: any) => console.log(ans));
}

// Calling the functions

// createCollectionTest();
// getCollectionsTest();
// deleteCollection();
// createRecord();
// readRecord();
// deleteRecord();
// listRecords();
// countRecords();
