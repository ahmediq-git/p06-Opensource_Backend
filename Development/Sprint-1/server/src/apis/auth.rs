use std::sync::{Arc, Mutex};

use axum::{
    debug_handler,
    http::{header::SET_COOKIE, HeaderMap, HeaderName, StatusCode},
    response::AppendHeaders,
    Error, Extension, Json,
};
use ejdb::{
    bson::ordered::OrderedDocument,
    query::{Q, QH},
    Database,
};
use serde::Deserialize;

use crate::{
    auth::{create_key, create_session, create_user, delete_session},
    utils::{hash_verify, validate_credentials},
};

#[derive(Deserialize, Debug)]
pub struct SignupLogin {
    email: String,
    password: String,
}

#[debug_handler]
pub async fn signup_email(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<SignupLogin>,
) -> Result<
    (
        AppendHeaders<[(HeaderName, std::string::String); 1]>,
        Json<OrderedDocument>,
    ),
    (StatusCode, Json<String>),
> {
    if let Err(msg) = validate_credentials(&data.email, &data.password) {
        return Err((StatusCode::BAD_REQUEST, Json(msg)));
    }
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    let session = match create_user(
        &db_guard,
        "email".to_string(),
        data.email,
        Some(data.password),
    ) {
        Ok(user) => {
            let session = create_session(&db_guard, user.get("user_id").unwrap().to_string());
            session
        }
        Err(error) => return Err((StatusCode::BAD_REQUEST, Json(error))),
    };
    let session_id = session.get("session_id").unwrap().to_string();
    let headers = AppendHeaders([(SET_COOKIE, format!("session={}", session_id))]);
    Ok((headers, Json(session)))
}

#[debug_handler]
pub async fn login_email(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<SignupLogin>,
) -> Result<
    (
        AppendHeaders<[(HeaderName, std::string::String); 1]>,
        Json<OrderedDocument>,
    ),
    Json<String>,
> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = db_guard.collection("user_key").unwrap();
    let email_count = coll
        .query(Q.field("provider_userid").eq(&data.email), QH.empty())
        .count()
        .unwrap();
    if email_count > 0 {
        let user_key = coll
            .query(Q.field("provider_userid").eq(data.email), QH.empty())
            .find_one()
            .unwrap()
            .unwrap();
        let stored_pass = user_key.get("password").unwrap().to_string();
        let trimmed_pass = stored_pass.trim_matches('"').to_string();
        if hash_verify(data.password, trimmed_pass) {
            let user_id = user_key.get("user_id").unwrap().to_string();
            let session = create_session(&db_guard, user_id);
            let session_id = session.get("session_id").unwrap().to_string();
            let headers = AppendHeaders([(SET_COOKIE, format!("session={}", session_id))]);

            Ok((headers, Json(session)))
        } else {
            return Err(Json("Passwords do not match".to_string()));
        }
    } else {
        Err(Json("User does not exist".to_string()))
    }
}

pub async fn logout(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    headers: HeaderMap,
) -> (StatusCode, Json<String>) {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    match delete_session(&db_guard, headers) {
        Ok(code) => (code, Json("Logged out".to_string())),
        Err(code) => (code, Json("Error logging out".to_string())),
    }
}
