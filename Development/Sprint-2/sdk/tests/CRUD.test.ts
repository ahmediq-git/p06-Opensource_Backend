// // import { add } from '../src';

// // test('adds two numbers correctly', () => {
// //   const result = add(2, 3);
// //   expect(result).toBe(5);
// // });

// // import ezbase from 'ezbase-ts';
// import * as ezbasesdk from "../src/index";

// const eb = new ezbase("http://localhost:3690");

// describe("EZbase Typescript SDK Tests", () => {
//     // 1) Test for createCollection()
//     test("createCollection", async () => {
//         console.log("");
//         console.log("Testing creation of collections");
//         const response = await eb.db.createCollection("TestSDKCollection1");
//         // console.log(cct1);
//         expect(response).toBe("Collection created successfully"); // add appropriate expectations
//     });

//     // 2) Test for getCollectionsTest()
//     test("getCollections", async () => {
//         console.log("Testing getting names of all Collections (should return all collection names)");
//         const response = await eb.db.getAllCollections();
//         // console.log(collections);
//         expect(response).toBeDefined(); // add appropriate expectations
//     });

//     // 3) Test for deleteCollection()
//     test("deleteCollection", async () => {
//         try {
//             console.log("Testing deletion of a collection");
//             const response = await eb.db.deleteCollection("TestSDKCollection1");
//             // console.log("Response received for deleteCollection: ", response);
//             expect(response).toBeDefined(); // add appropriate expectations
//         } catch (err) {
//             console.log("Error received for deleteCollection: ", err);
//             throw err; // let Jest handle the error
//         }
//     });

//     // 4) Test for createRecord
//     test("createRecord", async () => {
//         console.log("Testing insertion of a single field document");
//         const response = await eb.db.createRecord("TestSDKCollection1", { "name": "John Doe" });
//         // console.log(result);
//         expect(response).toBeDefined(); // add appropriate expectations
//     });

//     // 5) Test for readRecord
//     test("readRecord", async () => {
//         console.log("Testing reading a single field document");
//         const response = await eb.db.readRecord("TestSDKCollection1", { "name": "John Doe" });
//         // console.log(result);
//         expect(response).toBeDefined(); // add appropriate expectations
//     });

//     // 6) Test for deleteRecord
//     test("deleteRecord", async () => {
//         console.log("Testing deletion of a single field document");
//         const response = await eb.db.deleteRecord("TestSDKCollection1", { "name": "John Doe" }, true);
//         // console.log(result);
//         expect(response).toBeDefined(); // add appropriate expectations
//     });

//     // 7) Test for listRecords
//     test("listRecords", async () => {
//         console.log("Testing listing of all documents in a collection");
//         const response = await eb.db.listRecords("TestSDKCollection1", {}, {});
//         // console.log(result);
//         expect(response).toBeDefined(); // add appropriate expectations
//     });

//     // 8) Test for countRecords
//     test("countRecords", async () => {
//         console.log("Testing counting of all documents in a collection");
//         const response = await eb.db.countRecords("TestSDKCollection1", { "name": "John Doe" });
//         // console.log(result);
//         expect(response).toBeDefined(); // add appropriate expectations
//     });
// });


