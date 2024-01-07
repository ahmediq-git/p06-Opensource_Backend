use std::sync::{Arc, Mutex};

use axum::{extract::Path, http::StatusCode, Extension, Json};
use ejdb::{
    bson,
    bson::ordered::OrderedDocument,
    query::{Q, QH},
    Database,
};
use serde::Deserialize;
use serde_json::Value;

#[derive(Deserialize, Debug)]
pub struct InsertDoc {
    collection_name: String,
    field_name: String,
    field_value: Value,
}

pub async fn insert_doc(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<InsertDoc>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = db_guard.collection(data.collection_name).unwrap();
    let field_name = data.field_name;
    let field_value = data.field_value;
    let doc = bson! {
        field_name => field_value
    };
    let doc_id = coll.save(&doc);
    if doc_id.is_err() {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json("".to_string()));
    } else {
        (StatusCode::OK, Json(doc_id.unwrap().to_string()))
    }
}

// Json structure should be like this:
// {
//     "collection_name": "Users",
//     "data": {
//       "Height": 185,
//       "Color": "Brown",
//       "Hand": "Right"
//     }
//   }
pub async fn insert_doc_multifield(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<Value>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = db_guard
        .collection(data["collection_name"].as_str().unwrap())
        .unwrap();
    let data = bson! {data["data"].clone()};

    let result = coll.save(data.as_document().unwrap());
    if result.is_err() {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json("".to_string()));
    } else {
        (StatusCode::OK, Json(result.unwrap().to_string()))
    }
}

// Json structure should be like this:
// {
//     "collection_name": "Users",
//     "docs": {
//       "0": {
//        "Height": 185,
//        "Color": "Brown",
//        "Hand": "Right"
//       },
//       "1": {
//        "Height": 195,
//        "Color": "Brown",
//        "Hand": "Left"
//       }
//     }
//   }
pub async fn insert_docs(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<Value>,
) -> (StatusCode, Json<Vec<String>>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = match db_guard.collection(data["collection_name"].as_str().unwrap()) {
        Ok(coll) => coll,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json(vec![])),
    };
    let docs = data["docs"].as_object().unwrap();
    let mut ret_ids: Vec<String> = Vec::new();
    for (_doc, data) in docs.iter() {
        let data = bson! { data.clone() };
        let doc_id = coll.save(data.as_document().unwrap()).unwrap();
        ret_ids.push(doc_id.to_string());
    }
    (StatusCode::OK, Json(ret_ids))
}

#[derive(Deserialize, Debug)]
pub struct GetDoc {
    collection_name: String,
    doc_id: String,
}

pub async fn read_doc(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Path(GetDoc {
        collection_name,
        doc_id,
    }): Path<GetDoc>,
) -> Result<Json<Vec<OrderedDocument>>, (StatusCode, Json<String>)> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    match db_guard.get_collection(collection_name).unwrap() {
        Some(coll) => {
            let result = coll
                .query(Q.field("_id").eq(doc_id), QH.empty())
                .find()
                .unwrap();
            let mut ret_vec: Vec<OrderedDocument> = Vec::new();
            for (_x, i) in result.enumerate() {
                let x = i.unwrap();
                ret_vec.push(x);
            }
            Ok(Json(ret_vec))
        }
        None => Err((
            StatusCode::NOT_FOUND,
            Json("Collection does not exist!".to_string()),
        )),
    }
}

#[derive(Deserialize, Debug)]
pub struct InsertField {
    collection_name: String,
    doc_id: String,
    field_name: String,
    field_value: Value,
}
pub async fn insert_field(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<InsertField>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = match db_guard.collection(data.collection_name) {
        Ok(coll) => coll,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("".to_string())),
    };

    let _result = coll
        .query(
            Q.field("_id")
                .eq(data.doc_id)
                .set(data.field_name, data.field_value),
            QH.empty(),
        )
        .update();
    match _result {
        Ok(_) => (
            StatusCode::OK,
            Json("Field Added Successfully!".to_string()),
        ),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json("Error Adding Field!".to_string()),
        ),
    }
}

#[derive(Deserialize, Debug)]
pub struct DeleteDoc {
    collection_name: String,
    doc_id: String,
}

pub async fn delete_doc(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<DeleteDoc>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = match db_guard.collection(data.collection_name) {
        Ok(coll) => coll,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("".to_string())),
    };
    let q = Q.field("_id").eq(data.doc_id).drop_all();
    match coll.query(q, QH.empty()).update() {
        Ok(_) => (StatusCode::OK, Json("Document Deleted!".to_string())),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json("Error Deleting Document!".to_string()),
        ),
    }
}

// Json structure should be like this:
// {
//     "collection_name": "Users",
//     "doc_id": "65019caf8526205200000000",
//     "fields_to_insert": {
//       "Height": 185,
//       "Color": "Brown",
//       "Hand": "Right"
//     }
//   }
pub async fn insert_many_fields(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<Value>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    let coll = match db_guard.collection(data["collection_name"].as_str().unwrap()) {
        Ok(coll) => coll,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("".to_string())),
    };
    let fields_to_insert = bson! {data["fields_to_insert"].clone()};

    match coll
        .query(
            Q.field("_id")
                .eq(data["doc_id"].clone())
                .set_many(fields_to_insert.as_document().unwrap().clone()),
            QH.empty(),
        )
        .update()
    {
        Ok(_) => (
            StatusCode::OK,
            Json("Fields Added Successfully!".to_string()),
        ),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json("Error Adding Fields!".to_string()),
        ),
    }
}

#[derive(Deserialize, Debug)]
pub struct OneFieldSearch {
    collection_name: String,
    search_key: String,
    search_value: Value,
}

pub async fn search_doc_by_one_field(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<OneFieldSearch>,
) -> Result<Json<Vec<OrderedDocument>>, (StatusCode, Json<String>)> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    match db_guard.get_collection(data.collection_name).unwrap() {
        Some(coll) => {
            let result = coll
                .query(Q.field(data.search_key).eq(data.search_value), QH.empty())
                .find()
                .unwrap();
            let mut ret_vec: Vec<OrderedDocument> = Vec::new();
            for (_x, i) in result.enumerate() {
                let x = i.unwrap();
                ret_vec.push(x);
            }
            Ok(Json(ret_vec))
        }
        None => Err((
            StatusCode::NOT_FOUND,
            Json("Collection does not exist!".to_owned()),
        )),
    }
}

#[derive(Deserialize, Debug)]
pub struct CreateIndex {
    collection_name: String,
    field_name: String,
    index_type: String, //ejdb has "string", "number", "array"
}

pub async fn create_index(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<CreateIndex>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    match db_guard.get_collection(data.collection_name).unwrap() {
        Some(coll) => {
            if data.index_type == "string" {
                coll.index(data.field_name).string(true).set().unwrap();
            } else if data.index_type == "number" {
                coll.index(data.field_name).number().set().unwrap();
            } else if data.index_type == "array" {
                coll.index(data.field_name).array().set().unwrap();
            }
            (StatusCode::OK, Json("Index created".to_owned()))
        }
        None => (
            StatusCode::NOT_FOUND,
            Json("Collection does not exist!".to_owned()),
        ),
    }
}

#[derive(Deserialize, Debug)]
pub struct DeleteIndex {
    collection_name: String,
    field_name: String,
    index_type: String,
}

pub async fn delete_index(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<DeleteIndex>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    match db_guard.get_collection(data.collection_name).unwrap() {
        Some(coll) => {
            if data.index_type == "string" {
                coll.index(data.field_name).string(true).drop().unwrap();
            } else if data.index_type == "number" {
                coll.index(data.field_name).number().drop().unwrap();
            } else if data.index_type == "array" {
                coll.index(data.field_name).array().drop().unwrap();
            }
            (StatusCode::OK, Json("Index Deleted".to_owned()))
        }
        None => (
            StatusCode::NOT_FOUND,
            Json("Collection does not exist!".to_owned()),
        ),
    }
}

pub async fn delete_all_indices(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<DeleteIndex>,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    match db_guard.get_collection(data.collection_name).unwrap() {
        Some(coll) => {
            coll.index(data.field_name).drop_all().unwrap();
            (StatusCode::OK, Json("All indices deleted".to_owned()))
        }
        None => (
            StatusCode::NOT_FOUND,
            Json("Collection does not exist!".to_owned()),
        ),
    }
}
