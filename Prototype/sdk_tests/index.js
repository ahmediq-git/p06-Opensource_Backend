import ezbase from 'ezbase';
const eb = new ezbase("http://0.0.0.0:3690");

//1 createCollection
function createCollectionTest(){
  console.log("")
  console.log("Testing creation of  collections")
  eb.database.createCollection("newcol1")
  eb.database.createCollection("newcol2")
  console.log("")
}
// There should be ezbase.db file in the server and a "newcol1" file in the server end

//2 insertSingleFieldDoc
function insertSingleFieldDocTest(){
  console.log("Testing insertSingleFieldDoc")
  let id;
  eb.database.insertSingleFieldDoc("newcol1", {"name": "sample"})
    .then((ans) => {
      id = ans;
      return id
    })
    .catch((error) => {
      console.error(error);
    });
}

//3 getAllDocs
function getAllDocsTest(){
  console.log("Testing of getAllDocs on newcol1")
  eb.database.getAllDocs("newcol1").then(ans=>console.log(ans))
  console.log("")
}

// There should only be a collection with 1 doc of just one key and value

//4 insertDoc
function insertDocTest(){
  console.log("Testing of insertDoc (Doc should be of arbitrary fields), it returns doc id")
  eb.database.insertDoc("newcol1",{"name":"A", "age":25}).then((id)=>{console.log(id)})
  console.log("")
}
//5 insertField
function insertFieldTest(id){
  console.log("Testing of insertField on newcol1")
  eb.database.insertField("newcol1", id, {"height":123})
  eb.database.getAllDocs("newcol1").then(ans=>console.log(ans))
  console.log("")
}

//6 deleteDoc
function deleteDocTest(id){
  console.log("Testing delete doc")
  eb.database.deleteDoc("newcol1", id)
  eb.database.getAllDocs("newcol1").then(ans=>console.log("after deletion of a doc", ans))
}
//7 insertManyFields
function insertManyFieldsTest(id){
  console.log("Testing insertManyFields")
  eb.database.insertManyFields("newcol1", id, {"height":175, "age":28})
}


//8 getDoc

function getDocTest(id){
  console.log("Testing getDoc")
  eb.database.getDoc("newcol1", id).then(ans=>console.log(ans))
}

//9 updateDoc
function updateDocTest(id){
  console.log("Testing updateDoc")
  eb.database.updateDoc("newcol1", id, {"name":"new name", "age":20})
}

//10 insertManyDocs
function insertManyDocsTest(){
  console.log("Testing insertManyDocs")
  eb.database.insertManyDocs("newcol2", [{"name":"A", "age":20}, {"name":"B"}, {"name":"C"}]).then((resp)=>console.log("We got response", resp))
  eb.database.getAllDocs("newcol2").then(ans=>console.log("after inserting many docs", ans))
}

//11 findDoc
function findDocTest(){
  console.log("Testing findDoc")
  eb.database.findDoc("newcol2", {"age":2}).then((ans)=>console.log(ans))
}

//12 getCollectionNames()
function getCollectionNamesTest(){
  console.log("Testing getting names of all Collections (should return all collection names)")
  eb.database.getCollectionNames().then(ans=>console.log(ans))
}

//13 deleteCollection()
function deleteCollection(){
  console.log("Testing deletion of a collection")
  eb.database.deleteCollection("newcol2") 
}


// Calling the functions

// where id is written change id according to what is received from server when testing

createCollectionTest()
// insertSingleFieldDocTest()
// getAllDocsTest()
// insertDocTest() // issue
// insertFieldTest("6557a315adeb935c00000000")
// deleteDocTest("6557a315adeb935c00000000")


// insertManyFieldsTest("6557a47cdefcef5c00000000")
// getDocTest("6557af222815ab5f00020000")
// updateDocTest("6557af222815ab5f00000000")

// insertManyDocsTest()
// findDocTest()

// getCollectionNamesTest()
// deleteCollection()