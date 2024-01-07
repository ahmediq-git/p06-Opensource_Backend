import ezbase from 'ezbase';
const eb = new ezbase("http://0.0.0.0:3690");  

//1 createCollection
function createCollectionTest(){
  console.log("")
  console.log("Testing creation of  collections")
  eb.db.createCollection("newcol1")
  eb.db.createCollection("newcol2")
  console.log("")
}
// There should be ezbase.db file in the server and a "newcol1" file in the server end

//2 insertSingleFieldDoc
function insertSingleFieldDocTest(){
  console.log("Testing insertSingleFieldDoc")
  let id;
  eb.db.insertSingleFieldDoc("newcol1", {"name": "sample"})
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
  eb.db.getAllDocs("newcol1").then(ans=>console.log(ans))
  console.log("")
}

// There should only be a collection with 1 doc of just one key and value

//4 insertDoc
function insertDocTest(){
  console.log("Testing of insertDoc (Doc should be of arbitrary fields), it returns doc id")
  eb.db.insertDoc("newcol1",{"name":"A", "age":25}).then((id)=>{console.log(id)})
  console.log("")
}
//5 insertField
function insertFieldTest(id){
  console.log("Testing of insertField on newcol1")
  eb.db.insertField("newcol1", id, {"height":123})
  eb.db.getAllDocs("newcol1").then(ans=>console.log(ans))
  console.log("")
}

//6 deleteDoc
function deleteDocTest(id){
  console.log("Testing delete doc")
  eb.db.deleteDoc("newcol1", id)
  eb.db.getAllDocs("newcol1").then(ans=>console.log("after deletion of a doc", ans))
}
//7 insertManyFields
function insertManyFieldsTest(id){
  console.log("Testing insertManyFields")
  eb.db.insertManyFields("newcol1", id, {"height":175, "age":28})
}


//8 getDoc

function getDocTest(id){
  console.log("Testing getDoc")
  eb.db.getDoc("newcol1", id).then(ans=>console.log(ans))
}

//9 updateDoc
function updateDocTest(id){
  console.log("Testing updateDoc")
  eb.db.updateDoc("newcol1", id, {"name":"new name", "age":20})
}

//10 insertManyDocs
function insertManyDocsTest(){
  console.log("Testing insertManyDocs")
  eb.db.insertManyDocs("newcol2", [{"name":"A", "age":20}, {"name":"B"}, {"name":"C"}]).then((resp)=>console.log("We got response", resp))
  eb.db.getAllDocs("newcol2").then(ans=>console.log("after inserting many docs", ans))
}

//11 findDoc
function findDocTest(){
  console.log("Testing findDoc")
  eb.db.findDoc("newcol2", {"age":20}).then((ans)=>console.log(ans))
}

//12 getCollectionNames()
function getCollectionNamesTest(){
  console.log("Testing getting names of all Collections (should return all collection names)")
  eb.db.getCollectionNames().then(ans=>console.log(ans))
}

//13 deleteCollection()
function deleteCollection(){
  console.log("Testing deletion of a collection")
  eb.db.deleteCollection("newcol2") 
}


// Calling the functions

// where id is written change id according to what is received from server when testing

// createCollectionTest()
// insertSingleFieldDocTest()
signinTest();

setTimeout(function() {
  insertDocTest();
  getCollectionNamesTest();
  getAllDocsTest();
  eb.db.getAllDocs("config").then(ans=>console.log(ans))
}, 5000);

// insertDocTest();
// insertFieldTest("6557a315adeb935c00000000")
// deleteDocTest("6557a315adeb935c00000000")
// getAllDocsTest()
// 

// insertManyFieldsTest("6557a47cdefcef5c00000000")
// getDocTest("6559ab93e0730f6200000000")
// updateDocTest("6557af222815ab5f00000000")

// insertManyDocsTest()
// findDocTest()

// getCollectionNamesTest()
// deleteCollection()


function signupTest(){
  console.log("Testing sign up")
  eb.auth.signUp("email2@gmail.com", "hehehehe")
}

function signinTest(){
  console.log("Testing sign in")
  eb.auth.signIn("email1@gmail.com", "hehehehe")
}

function signoutTest(){
  console.log("Sign out test")
  eb.auth.signOut()
}

// signupTest()
// // signinTest()
// // getAllDocsTest()
// setTimeout(function() {
//   signoutTest();
//   getCollectionNamesTest()
// }, 5000); // 5000 milliseconds = 5 seconds

eb.db.getAllDocs()