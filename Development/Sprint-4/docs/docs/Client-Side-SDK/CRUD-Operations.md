---
sidebar_position: 2
---

# CRUD Operations
With the help of the client-side Javacript SDK, developers can make use of multiple useful Create Read Update Delete (CRUD) actions.
### Create a Collection
Creates a new collection.
```js
import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
eb.db.createCollection("example-collection");
```
### Delete a Collection
Deletes an existing collection.
```js
import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
eb.db.deleteCollection("example-collection");
```

### Get Collections' Names
Get all the collections' names currently present in the database.
```js
import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const getCollections = async (id) => {
    try {
        // get the collections' names from the database
        const collections = await eb.db.getCollectionNames();
        ...
    } catch (error) {
      console.error('Error getting collections:', error);
    }
  };

```

### Create a Single-Field Document
Creates a single-field document in a collection.
```js
import ezbase from 'ezbase'
const eb = new ezbase("http://0.0.0.0:3690"); 
...
const createSingleFieldDoc = async (id) => {
    try {
        // create the document from the database
        const docIndex = await eb.db.insertSingleFieldDoc("newcol1", {"name": "Lorem Ipsum"});
        ...
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

```

### Create a Document
Creates a new document in a collection.
```js
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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
import ezbase from 'ezbase'
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


