use axum::http::StatusCode;
use axum::{Extension, Json};
use ejdb::bson::ordered::OrderedDocument;
use ejdb::query::{Q, QH};
use ejdb::Database;
use std::sync::{Arc, Mutex};

pub async fn get_logs(
    Extension(db): Extension<Arc<Mutex<Database>>>,
) -> Result<Json<Vec<OrderedDocument>>, (StatusCode, Json<String>)> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    match db_guard.get_collection("request_logs").unwrap() {
        Some(coll) => {
            let result = coll.query(Q.empty(), QH.empty()).find().unwrap();
            let mut ret_vec: Vec<OrderedDocument> = Vec::new();
            for (_x, document) in result.enumerate() {
                ret_vec.push(document.unwrap());
            }
            Ok(Json(ret_vec))
        }
        None => Err((
            StatusCode::NOT_FOUND,
            Json("Collection does not exist!".to_string()),
        )),
    }
}
