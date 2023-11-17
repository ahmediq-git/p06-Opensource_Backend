import ezbase from 'ezbase';
const eb = new ezbase("http://0.0.0.0:3690");

function insertSingleFieldDocTest(){
    let id;
    eb.database.insertSingleFieldDoc("newcol1", {"name": "ahmed"})
      .then((ans) => {
        id = ans;
        console.log(id)
        return id
      })
      .catch((error) => {
        console.error(error);
      });
}

let id=insertSingleFieldDocTest()
console.log(id)