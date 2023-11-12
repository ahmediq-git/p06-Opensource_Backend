use axum::Json;
use ejdb::{
    bson::ordered::OrderedDocument,
    query::{Q, QH},
    Database,
};
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct CreateCollection {
    collection_name: String,
}

pub async fn create_collection(Json(data): Json<CreateCollection>) -> Json<String> {
    let db = Database::open("ezbase.db").unwrap();
    let _coll = db.collection(data.collection_name).unwrap();
    Json("Collection Created!".to_owned())
}

#[derive(Deserialize, Debug)]
pub struct DeleteCollection {
    collection_name: String,
    delete_all_data: bool,
}

pub async fn delete_collection(Json(data): Json<DeleteCollection>) -> Json<String> {
    let db = Database::open("ezbase.db").unwrap();
    db.drop_collection(data.collection_name, data.delete_all_data)
        .unwrap();
    Json("Collection Deleted!".to_owned())
}

#[derive(Deserialize, Debug)]
pub struct GetAllDocs {
    collection_name: String,
}

pub async fn get_all_docs(Json(data): Json<GetAllDocs>) -> Json<Vec<OrderedDocument>> {
    let db = Database::open("ezbase.db").unwrap();
    let coll = db.collection(data.collection_name).unwrap();
    let result = coll.query(Q.empty(), QH.empty()).find().unwrap();
    let mut ret_vec: Vec<OrderedDocument> = Vec::new();
    for (_x, document) in result.enumerate() {
        ret_vec.push(document.unwrap());
    }
    Json(ret_vec)
}

pub async fn get_collection_names() -> Json<Vec<String>> {
    let db = Database::open("ezbase.db").unwrap();
    let db_meta = db.get_metadata().unwrap();
    let colls_arr = db_meta.get("collections").unwrap().as_array().unwrap();
    let mut coll_names: Vec<String> = Vec::new();
    for (i, data) in colls_arr.iter().enumerate() {
        let name = data.as_document().unwrap().get("name").unwrap().to_string();
        coll_names.push(name[1..name.len() - 1].to_owned())
    }
    Json(coll_names)
}
