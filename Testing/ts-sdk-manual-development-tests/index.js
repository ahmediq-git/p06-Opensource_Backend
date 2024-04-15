"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../Development/Sprint-4/sdk/dist/index"));
const fs = __importStar(require("fs"));
const eb = new index_1.default("http://localhost:3690", "http://localhost:3691");
// 1) Test for createCollection()
function createCollectionTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("");
        console.log("Testing creation of collections");
        const cct1 = yield eb.db.createCollection("TestSDKCollection1");
        console.log(cct1);
    });
}
// 2) Test for getCollectionsTest()
function getCollectionsTest() {
    console.log("Testing getting names of all Collections (should return all collection names)");
    eb.db.getAllCollections().then((ans) => console.log(ans));
}
//3) Test for insertSingleFieldDoc()
function deleteCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Testing deletion of a collection");
            const response = yield eb.db.deleteCollection("TestSDKCollection1");
            console.log("Response received for deleteCollection: ", response);
        }
        catch (err) {
            console.log("Error received for deleteCollection: ", err);
        }
    });
}
// 4) Test for createRecord`
function createRecord() {
    console.log("Testing insertion of a single field document");
    eb.db.createRecord("TestSDKCollection1", { "name": "John Doe" }).then((ans) => console.log(ans));
}
// 5) Test for readRecord()
function readRecord() {
    console.log("Testing reading a single field document");
    eb.db.readRecord("TestSDKCollection1", { "name": "John Doe" }).then((ans) => console.log(ans));
}
// 6) Test for deleteRecord()
function deleteRecord() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing deletion of a single field document");
        const result = yield eb.db.deleteRecord("TestSDKCollection1", { "name": "John Doe" }, true).then((ans) => console.log(ans));
    });
}
// 7) Test for listRecords()
// function listRecords(): void {
//     console.log("Testing listing of all documents in a collection");
//     eb.db.listRecords("TestSDKCollection1", {}, {}).then((ans: any) => console.log(ans));
// }
// 8) Test for countRecords()
function countRecords() {
    console.log("Testing counting of all documents in a collection");
    eb.db.countRecords("TestSDKCollection1", { "name": "John Doe" }).then((ans) => console.log(ans));
}
function sendTextMail() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing sending mail");
        const res = yield eb.mail.sendTextMail("moizwwww@gmail.com", "Test Subject", "Test Body").then((ans) => console.log(ans));
        console.log(res);
    });
}
function auth() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing authentication");
        const res = yield eb.auth.signUp("moiztest1@gmail.com", "moiztest").then((ans) => console.log(ans));
        console.log("token", eb.auth.getToken());
        console.log("send req to server");
        const res2 = yield eb.auth.signIn("moiztest1@gmail.com", "moiztest").then((ans) => console.log(ans));
        const cct1 = yield eb.db.createCollection("TestSDKCollection2");
        console.log(cct1);
        console.log("");
    });
}
function getAzureFileSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing getting azure file settings");
        const res = yield eb.files.getFileSettings().then((ans) => console.log(ans));
    });
}
function uploadFile() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing uploading a file");
        const localFilePath = "./uploadFileTest.txt";
        const blob = fs.readFileSync(localFilePath);
        const file = new File([blob], "uploadFileTest.txt"); // Convert Buffer to File
        const res = yield eb.files.uploadFile(file).then((ans) => console.log(ans));
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
getAzureFileSettings();
