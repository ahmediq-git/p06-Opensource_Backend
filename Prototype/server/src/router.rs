use crate::apis::collection::{create_collection, delete_collection, get_all_docs};
use crate::apis::document::{delete_doc, insert_doc, insert_field, insert_many_fields, read_doc};
use axum::{
    http::{header::CONTENT_TYPE, Method},
    routing::{delete, get, post},
    Router,
};
use tower_http::cors::{Any, CorsLayer};
pub fn get_router() -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::POST, Method::GET, Method::PATCH, Method::DELETE])
        .allow_origin(Any)
        .allow_headers([CONTENT_TYPE]);

    let router = Router::new()
        .route("/create_collection", post(create_collection))
        .route("/delete_collection", delete(delete_collection))
        .route("/get_all_docs", get(get_all_docs))
        .route("/insert_doc", post(insert_doc))
        .route("/get_doc", get(read_doc))
        .route("/insert_field", post(insert_field))
        .route("/delete_doc", delete(delete_doc))
        .route("/insert_many_fields", post(insert_many_fields))
        .layer(cors);

    router
}
