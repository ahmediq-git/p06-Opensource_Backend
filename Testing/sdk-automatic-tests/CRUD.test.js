import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690")

beforeAll(async () => {
    console.log("Create User for Testing");
    try {
        await eb.auth.signUp("testUser@gmail.com", "12345678");
        console.log("Test User created");

        // Sign in the user after successful signup
        await eb.auth.signIn("testUser@gmail.com", "12345678");
        console.log("Test User signed in");
    } catch (error) {
        console.log("Test User already exists");
    }
});

test("createCollection() and getCollectionNames() Test: Creating collections and getting Collection names", async () => {
    expect.assertions(1);

    // Create collections
    await eb.db.createCollection("test_collection");
    await eb.db.createCollection("test_collection_2");
    await eb.db.createCollection("test_collection_3");

    // Get collection names
    const collectionNames = await eb.db.getCollectionNames();

    // Assert that the collections are created
    expect(collectionNames).toEqual(expect.arrayContaining(["test_collection", "test_collection_2", "test_collection_3"]));
});


test("insertSingleFieldDoc() and getDoc() Test: inserting Doc of a single key,value pair", async () => {
    expect.assertions(1);

    // Insert Document
    const id = await eb.db.insertSingleFieldDoc("test_collection", { "name": "sample" });

    const doc = await eb.db.getDoc("test_collection", id);

    // Assert that the collections are created
    expect(doc[0].name).toEqual("sample");
});


test("insertDoc() and deleteDoc() Test: Inserting Doc of Many Fields, and deleting a single document from a collection", async () => {
    // Use expect.assertions() to ensure that a certain number of assertions are called
    expect.assertions(4);

    // Insert Document
    const id = await eb.db.insertDoc("test_collection", { "name": "sample2", "age": "54", "height": "6ft" });

    const doc = await eb.db.getDoc("test_collection", id);

    // Assert that the collections are created
    expect(doc[0].name).toEqual("sample2");
    expect(doc[0].age).toEqual("54");
    expect(doc[0].height).toEqual("6ft");

    // Delete the document
    await eb.db.deleteDoc("test_collection", id);

    // Trying to retrieve the deleted Doc
    const deletedDoc = await eb.db.getDoc("test_collection", id);

    expect(deletedDoc).toHaveLength(0);

});

test("insertField() Test: Inserting a single (key, value) pair field in a document in given collection", async () => {
    // Use expect.assertions() to ensure that a certain number of assertions are called
    expect.assertions(1);

    // Get collection names
    const id = await eb.db.insertSingleFieldDoc("test_collection", { "name": "sample insertField" });

    await eb.db.insertField("test_collection", id, { "new_field": "new_value" });

    const doc = await eb.db.getDoc("test_collection", id);

    expect(doc[0].new_field).toEqual("new_value");

});

test("insertManyFields() Test: Inserting Multiple fields in a document in given collection", async () => {
    expect.assertions(2);

    // Get collection names
    const id = await eb.db.insertSingleFieldDoc("test_collection", { "name": "sample insertField many" });

    await eb.db.insertManyFields("test_collection", id, { "new_field": "new_value", "new_field2": "new_value2" });

    const doc = await eb.db.getDoc("test_collection", id);

    expect(doc[0].new_field).toEqual("new_value");
    expect(doc[0].new_field2).toEqual("new_value2");
});

test("insertManyDocs() and getAllDocs() Test: Inserting many documents in a collection and getting all Docs from a collection", async () => {
    expect.assertions(1);

    const comparisonArray = [
        { "name": "sample insertField many", "age": 91 },
        { "name": "sample insertField many2" }
    ];

    const arrayOfIds = await eb.db.insertManyDocs("test_collection_2", comparisonArray);

    const docs = await eb.db.getAllDocs("test_collection_2");

    // Compare arrayOfIds with docs
    const matchingIds = arrayOfIds.filter(id => docs.some(doc => doc._id.$oid === id));


    expect(matchingIds.length).toBe(arrayOfIds.length);


});

test("updateDoc() Test: updating multiple fields of a document", async () => {
    expect.assertions(3);

    // Get collection names
    const id = await eb.db.insertSingleFieldDoc("test_collection", { "name": "sample update doc" });

    await eb.db.updateDoc("test_collection", id, { "name": "new_overwritten_name", "new_field": "new_value", "new_field2": "new_value2" });

    const doc = await eb.db.getDoc("test_collection", id);

    expect(doc[0].name).toEqual("new_overwritten_name");
    expect(doc[0].new_field).toEqual("new_value");
    expect(doc[0].new_field2).toEqual("new_value2");

});

test("findDoc() Test: Finds all documents fulfilling the query, query is a single key, value pair", async () => {
    expect.assertions(2);

    const sampleArray = [
        { name: 'Object 1', color: 'blue', size: 'small' },
        { name: 'Object 2', color: 'red', size: 'medium' },
        { name: 'Object 3', color: 'green', size: 'large' },
        { name: 'Object 4', color: 'red', size: 'small' },
        { name: 'Object 5', color: 'yellow', size: 'medium' },
        { name: 'Object 6', color: 'red', size: 'large' },
        { name: 'Object 7', color: 'purple', size: 'small' },
        { name: 'Object 8', color: 'red', size: 'medium' },
    ];

    await eb.db.insertManyDocs("test_collection_3", sampleArray);

    const docs = await eb.db.findDoc("test_collection_3", { color: "red" });
    const areAllRed = docs.every(doc => doc.color === 'red');

    expect(docs.length).toBe(4);
    expect(areAllRed).toBe(true);
});

test("deleteCollection() Test: Delete all collections one by one from the Database", async () => {
    expect.assertions(3);

    // Delete a collection
    await eb.db.deleteCollection("test_collection");
    const collectionNames = await eb.db.getCollectionNames();
    expect(collectionNames).not.toContain("test_collection");

    //Delete next collection
    await eb.db.deleteCollection("test_collection_2");
    const collectionNames2 = await eb.db.getCollectionNames();
    expect(collectionNames2).not.toContain("test_collection_2");

    // Delete final collection
    await eb.db.deleteCollection("test_collection_3");
    const collectionNames3 = await eb.db.getCollectionNames();

    expect(collectionNames3).not.toContain("test_collection_3");
});
