use std::sync::{Arc, Mutex};
use std::sync::MutexGuard;

use crate::apis::auth::{login_email, logout, signin_admin, signup_admin, signup_email};
use crate::apis::collection::{
    create_collection, delete_collection, get_all_docs, get_collection_names,
};
use crate::apis::document::{
    create_index, delete_all_indices, delete_doc, delete_index, insert_doc, insert_doc_multifield,
    insert_docs, insert_field, insert_many_fields, read_doc, search_doc_by_one_field,
};
use crate::apis::logs::get_logs;
use crate::middleware::{auth::auth_validate, tracer::trace};
use crate::utils::jwt::generate_secret;
use axum::{
    http::{header::CONTENT_TYPE, Method},
    routing::{delete, get, post},
    Router,
};
use axum::{middleware, Extension};
use ejdb::bson;
use ejdb::query::{Q, QH};
use ejdb::Database;
use tower_http::cors::{Any, CorsLayer};

pub fn get_router() -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::POST, Method::GET, Method::PATCH, Method::DELETE])
        .allow_origin(Any)
        .allow_headers([CONTENT_TYPE]);

    //Arc and Mutex allow for Sync and Clone
    let db: Arc<Mutex<Database>> = Arc::new(Mutex::new(Database::open("ezbase.db").unwrap()));

    initialize_auth_collections(&db.lock().unwrap());

    let db_guard = db.clone();
    let db_guard = db_guard.lock().unwrap();
    //settings collection = {{key: secret, value: secret_value}, {key:smtp_credntials, value: {username, password, host, port}}, {key: smtp_server, value: smtp_server_url}}
    let config = match db_guard.get_collection("config").unwrap() {
        Some(config_collection) => config_collection,
        None => db_guard.collection("config").unwrap(),
    };

    let config_data = config
        .query(Q.field("key").eq("secret"), QH.empty())
        .find_one();
    match config_data {
        Ok(data) => {
            match data {
                Some(doc) => {
                    let secret = doc
                        .get("value")
                        .unwrap()
                        .to_string()
                        .trim_matches('"')
                        .to_string();
                    if secret == "" {
                        let secret = generate_secret();

                        config
                            .query(
                                Q.field("key").eq("secret").set("value", secret.as_str()),
                                QH.empty(),
                            )
                            .update()
                            .unwrap();
                    }
                }
                None => {
                    let secret = generate_secret();
                    let data = bson!({
                        "key"=> "secret",
                        "value"=> secret
                    });
                    config.save(data).unwrap();
                }
            };
        }
        Err(e) => {
            println!("Error: {}", e);
        }
    }

    let log_db = Arc::new(Mutex::new(Database::open("logs.db").unwrap()));

    let router = Router::new()
        .route("/create_collection", post(create_collection))
        .route("/delete_collection", delete(delete_collection))
        .route("/get_all_docs/:collection_name", get(get_all_docs))
        .route("/insert_doc", post(insert_doc))
        .route("/insert_doc_multifield", post(insert_doc_multifield))
        .route("/insert_docs", post(insert_docs))
        .route("/get_doc/:collection_name/:doc_id", get(read_doc))
        .route("/insert_field", post(insert_field))
        .route("/delete_doc", delete(delete_doc))
        .route("/insert_many_fields", post(insert_many_fields))
        .route("/search_doc", post(search_doc_by_one_field))
        .route("/get_collection_names", get(get_collection_names))
        .route("/create_index", post(create_index))
        .route("/delete_index", delete(delete_index))
        .route("/delete_all_indices", delete(delete_all_indices))
        // .route_layer(middleware::from_fn_with_state(
        //     Arc::clone(&db),
        //     auth_validate,
        // ))
        .route("/signup_email", post(signup_email))
        .route("/signin_email", post(login_email))
        .route("/signout", get(logout))
        .route("/signup_admin", post(signup_admin))
        .route("/signin_admin", post(signin_admin))
        .layer(cors)
        .layer(Extension(db))
        .route("/get_logs", get(get_logs))
        .route_layer(Extension(Arc::clone(&log_db)))
        .layer(middleware::from_fn_with_state(log_db, trace));

    router
}

fn initialize_auth_collections(db: &MutexGuard<'_, Database>) {
    let coll = db.collection("user_key").unwrap();

    let coll = db.collection("user").unwrap();

    let coll = db.collection("session").unwrap();
}
