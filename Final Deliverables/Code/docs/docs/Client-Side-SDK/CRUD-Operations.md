---
sidebar_position: 2
---

# CRUD Operations
With the help of the client-side Javacript SDK, developers can make use of multiple useful Create Read Update Delete (CRUD) actions.
### Collection
Creating and deleteing a collection.
```js
import eb from "@src/eb";

// Create a collection
const result = await eb.db.createCollection(`Products`);

// Delete a collection
const result = await eb.db.deleteCollection(`Products`);

// returns a list of all the collections in the database
const resuslt = await eb.db.getCollections();

```

### Records
Each collection has a set of records. Since we are using a NoSQL database, we can store any kind of data in a record.

```js
// Create a record in a collection
const res = await eb.db.createRecord(`Products`, {
  title: `iPhone 12`,
  price: 1200,
  brand: `Apple`,
  category: `Smartphone`,
});
```
SDK provides the functionality to query records in a collection through a query object. This query object is similar to that used in MongoDb.

```js
// Read a record with a query
const res = await eb.db.readRecord(`Products`, {
  brand: `Apple`,
});

// Query on multiple fields
const res = await eb.db.readRecord(`Products`, {
  $or: [{ brand: "Apple" }, { brand: "Samsung" }],
});

const res = await eb.db.readRecord(`Products`, {
    $not: { brand: "Apple" },
});
```

### Create a Document
Creates a new document in a collection.
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const createDocument = async (id) => {
    try {
        // create the document from the database
        const docId = await eb.db.insertDoc("example-collection",{"name":"Lorem Ipsum", "age":25});
        ...
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

```

### Update a Document
Updates an existing document in a collection.
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const updateDocument = async (id) => {
    try {
        // update the document from the database
        eb.db.updateDoc("example-collection", id, {"name":"new name", "age":20})
        ...
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

```

### Insert Multiple Documents
Creates a multiple new documents in a collection.
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const createDocuments = async (id) => {
    try {
        // create documents from the database
        await eb.db.insertManyDocs("example-collection", [{"name":"A", "age":20}, {"name":"B"}, {"name":"C"}])
        ...
    } catch (error) {
      console.error('Error creating documents:', error);
    }
  };

```

### Delete a Document
Deletes an existing document in a collection.
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const deleteDocument = async (id) => {
    try {
        // delete the document from the database
        await eb.db.deleteDoc("example-collection", id);
        ...
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

```
### Read a Document
Gets a single document from a specific collection.
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const getDocument = async (id) => {
    try {
        // get the document from the database
        const doc = await eb.db.getDoc("example-collection", id);
        ...
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };
```
### Read a List of Documents
Gets all documents from a specific collection.
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const getAllDocuments = async (id) => {
    try {
        // get the document from the database
        const docs = await eb.db.getAllDocs("example-collection");
        ...
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

```

### Find a Document
Searches for a document from a collection.
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const findDocument = async (id) => {
    try {
        // find the document from the database
        await eb.db.findDoc("example-collection", {"age":20});
        ...
    } catch (error) {
      console.error('Error finding document:', error);
    }
  };

```


### Insert a Field in a Document
Inserts a new field to a document of a collection. 
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const insertNewField = async (id) => {
    try {
        // insert a field to the document of a collection
        await eb.db.insertField("example-collection", id, {"height":6})
        ...
    } catch (error) {
      console.error('Error inserting field:', error);
    }
  };

```

### Insert Many Fields in a Document
Inserts many new fields to a document of a collection. 
```js
import ezbase from 'ezbase-ts'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const insertNewFields = async (id) => {
    try {
        // insert multiple fields to the document of a collection
        await eb.db.insertManyFields("example-collection", id, {"height":175, "gender":"male"})
        ...
    } catch (error) {
      console.error('Error inserting field:', error);
    }
  };

```


