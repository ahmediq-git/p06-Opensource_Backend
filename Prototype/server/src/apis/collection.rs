use std::sync::{Arc, Mutex};

use axum::{
    extract::Path,
    http::StatusCode,
    response::{IntoResponse, Response},
    Extension, Json,
};
use ejdb::{
    bson::ordered::OrderedDocument,
    query::{Q, QH},
    Database,
};
use serde::Deserialize;

use crate::error::CustomError;

#[derive(Deserialize, Debug)]
pub struct CreateCollection {
    collection_name: String,
}

pub async fn create_collection(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<CreateCollection>,
) -> Result<Json<String>, Response> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    db_guard.collection(data.collection_name).map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to create collection",
        )
            .into_response()
    })?;
    Ok(Json("Collection Created!".to_owned()))
}

#[derive(Deserialize, Debug)]
pub struct DeleteCollection {
    collection_name: String,
    delete_all_data: bool,
}

pub async fn delete_collection(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<DeleteCollection>,
) -> Result<Json<String>, Response> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    db_guard
        .drop_collection(data.collection_name, data.delete_all_data)
        .unwrap();
    Ok(Json("Collection Deleted!".to_owned()))
}

#[derive(Deserialize, Debug)]
pub struct GetAllDocs {
    collection_name: String,
}

pub async fn get_all_docs(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Path(GetAllDocs { collection_name }): Path<GetAllDocs>,
) -> Result<Json<Vec<OrderedDocument>>, Response> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    let coll = db_guard
        .collection(collection_name)
        .map_err(|_| (StatusCode::NOT_FOUND, "Collection does not exist").into_response())?;
    let result = coll.query(Q.empty(), QH.empty()).find().map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to query documents",
        )
            .into_response()
    })?;

    let ret_vec: Vec<OrderedDocument> = result.collect::<Result<_, _>>().map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to process documents",
        )
            .into_response()
    })?;
    Ok(Json(ret_vec))
}

pub async fn get_collection_names(
    Extension(db): Extension<Arc<Mutex<Database>>>,
) -> Result<Json<Vec<String>>, Response> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    let db_meta = db_guard.get_metadata().map_err(|_| {
        (StatusCode::INTERNAL_SERVER_ERROR, "Failed to get metadata").into_response()
    })?;
    let colls_arr = db_meta
        .get("collections")
        .and_then(|doc| doc.as_array())
        .ok_or_else(|| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to get collection names",
            )
                .into_response()
        })?;

    let coll_names = colls_arr
        .iter()
        .filter_map(|data| {
            data.as_document()
                .and_then(|doc| doc.get("name").and_then(|name| name.as_str()))
        })
        .map(String::from)
        .collect();

    Ok(Json(coll_names))
}
