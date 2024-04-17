import ezbase from "../../Development/Sprint-4/sdk/dist/index";
import axios, { AxiosResponse } from 'axios';
import * as fs from "fs";
import { get } from "http";

const eb = new ezbase("http://localhost:3690", "http://localhost:3691");

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
// function listRecords(): void {
//     console.log("Testing listing of all documents in a collection");
//     eb.db.listRecords("TestSDKCollection1", {}, {}).then((ans: any) => console.log(ans));
// }

// 8) Test for countRecords()
function countRecords(): void {
    console.log("Testing counting of all documents in a collection");
    eb.db.countRecords("TestSDKCollection1", { "name": "John Doe" }).then((ans: any) => console.log(ans));
}

async function sendTextMail(): Promise<any> {
    console.log("Testing sending mail");
    const res = await eb.mail.sendTextMail("moizwwww@gmail.com", "Test Subject", "Test Body").then((ans: any) => console.log(ans));
    console.log(res);
}

async function auth(): Promise<any> {

    console.log("Testing authentication");

    const res = await eb.auth.signUp("moiztest1@gmail.com", "moiztest").then((ans: any) => console.log(ans));
    console.log("token", eb.auth.getToken())
    console.log("send req to server")
    const res2 = await eb.auth.signIn("moiztest1@gmail.com", "moiztest").then((ans: any) => console.log(ans));
    const cct1 = await eb.db.createCollection("TestSDKCollection2");
    console.log(cct1);

    console.log("");
}

async function getAzureFileSettings(): Promise<any> {
    console.log("Testing getting azure file settings");
    const res = await eb.files.getFileSettings().then((ans: any) => console.log(ans));
}

async function uploadFile(): Promise<any> {
    console.log("Testing uploading a file");
    const localFilePath = "./uploadFileTest.txt";
    const blob = fs.readFileSync(localFilePath);
    const file = new File([blob], "uploadFileTest.txt"); // Convert Buffer to File
    const res = await eb.files.uploadFile(file).then((ans: any) => console.log(ans));
}

async function getFileMetaData(): Promise<any> {
    console.log("Testing getting file metadata");
    const res = await eb.files.getFileMetaData("1fd84ff4785b4b79").then((ans: any) => console.log(ans));
}

async function getFileUrl(): Promise<any> {
    console.log("Testing getting file url");
    const res = await eb.files.getFileUrl("1fd84ff4785b4b79").then((ans: any) => console.log(ans));
}

async function getFile(): Promise<any> {
    console.log("Testing getting file");
    const res = await eb.files.getFile("dde6683657a44e7a.txt");
    console.log(res.data);
}

async function deleteFile(): Promise<any> {
    console.log("Testing deleting a file");
    const res = await eb.files.deleteFile("42258dc2feb34f9a").then((ans: any) => console.log(ans));
}

async function getFileContent(): Promise<any> {
    console.log("Testing downloading a file");
    const res = await eb.files.getFileContent("ddd0ed62aa42403d")
        .then((ans: any) => {
            console.log(ans);
            const fileBuffer = Buffer.from(ans.data, 'base64');
            // console.log("File received from server:", fileBuffer);
            fs.writeFileSync("./downloadedFile.txt", fileBuffer);
            console.log("File downloaded successfully as downloadedFile.txt");
        });
}
// Calling the functions
// sendTextMail();
// auth();
// createCollectionTest();
// getCollectionsTest();
// deleteCollection();
// createRecord();
// readRecord();
// deleteRecord();
// listRecords();
// countRecords();
// getAzureFileSettings();
// uploadFile();
// getFileMetaData();
// getFileUrl();
// getFile();
// deleteFile();
getFileContent();
