use std::sync::{Arc, Mutex};

use axum::{
    debug_handler,
    http::{header::SET_COOKIE, HeaderName},
    response::AppendHeaders,
    Extension, Json,
};
use ejdb::{
    bson::ordered::OrderedDocument,
    query::{Q, QH},
    Database,
};
use serde::Deserialize;
use tower_cookies::{cookie::CookieJar, CookieManager, Cookies};

use crate::auth::{create_key, create_session, create_user};

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
    Json<String>,
> {
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
        Err(error) => return Err(Json(error)),
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
        .query(Q.field("provider_userid").eq(data.email), QH.empty())
        .count()
        .unwrap();
    if email_count > 0 {
        let user_key = coll
            .query(Q.field("password").eq(data.password), QH.empty())
            .find_one();
        match user_key {
            Ok(user_key) => {
                let user_id = user_key.unwrap().get("user_id").unwrap().to_string();
                let session = create_session(&db_guard, user_id);
                let session_id = session.get("session_id").unwrap().to_string();
                let headers = AppendHeaders([(SET_COOKIE, format!("session={}", session_id))]);

                Ok((headers, Json(session)))
            }
            Err(_) => return Err(Json("Passwords do not match".to_string())),
        }
    } else {
        Err(Json("User does not exist".to_string()))
    }
}
