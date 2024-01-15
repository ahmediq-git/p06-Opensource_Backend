use std::sync::{Arc, Mutex};

use axum::{
    debug_handler,
    http::{header::SET_COOKIE, HeaderMap, HeaderName, StatusCode},
    response::AppendHeaders,
    Extension, Json,
};
use cookie::Cookie;

use ejdb::{
    query::{Q, QH},
    Database,
};
use serde::{Deserialize, Serialize};

use crate::{
    auth::{create_admin, create_session, create_user, delete_session},
    utils::auth::{hash_verify, validate_credentials, create_cookie_header},
    utils::jwt::{encrypt_jwt, get_secret, Claims},
};

#[derive(Deserialize, Debug)]
pub struct SignupLogin {
    email: String,
    password: String,
}
#[derive(Serialize)]
pub struct AuthResponse {
    user_id: String,
    session_id: String, // TODO: this is only for testing
}

#[debug_handler]
pub async fn signup_email(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<SignupLogin>,
) -> Result<
    (
        AppendHeaders<[(HeaderName, std::string::String); 1]>,
        Json<AuthResponse>,
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
    let response = match create_user(
        &db_guard,
        "email".to_string(),
        data.email,
        Some(data.password),
    ) {
        Ok(user) => {
            let user_id = user
                .get("user_id")
                .unwrap()
                .to_string()
                .trim_matches('"')
                .to_string();
            let session = create_session(&db_guard, user.get("user_id").unwrap().to_string());
            let secret = get_secret(&db_guard);
            let token = match secret {
                Ok(secret) => {
                    let token = encrypt_jwt(
                        secret,
                        Claims {
                            session_id: session
                                .get("session_id")
                                .unwrap()
                                .to_string()
                                .trim_matches('"')
                                .to_string(),
                            is_admin: false,
                            exp: session
                                .get("active_period_expires_at")
                                .unwrap()
                                .as_i64()
                                .unwrap(),
                        },
                    );
                    token.unwrap()
                }
                Err(_error) => {
                    return Err((StatusCode::BAD_REQUEST, Json("Secret not found".to_owned())))
                }
            };

            serde_json::json!(
                {
                    "user_id": user_id,
                    "session_id": session   .get("session_id")
                    .unwrap()
                    .to_string()
                    .trim_matches('"')
                    .to_string(),
                    "token": token
                }
            )
        }
        Err(error) => return Err((StatusCode::BAD_REQUEST, Json(error))),
    };
    let session_id = response["session_id"]
        .to_string()
        .trim_matches('"')
        .to_string();
    let user_id = response["user_id"]
        .to_string()
        .trim_matches('"')
        .to_string();
    let token = response["token"].to_string().trim_matches('"').to_string();

    let headers = AppendHeaders([(SET_COOKIE, format!("session={}", token))]);
    Ok((
        headers,
        Json(AuthResponse {
            user_id,
            session_id,
        }),
    ))
}

#[debug_handler]
pub async fn login_email(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<SignupLogin>,
) -> Result<
    (
        AppendHeaders<[(HeaderName, std::string::String); 1]>,
        Json<AuthResponse>,
    ),
    (StatusCode, Json<String>),
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
            let session = create_session(&db_guard, user_id.clone());
            let secret = get_secret(&db_guard);
            let token = match secret {
                Ok(secret) => {
                    let token = encrypt_jwt(
                        secret,
                        Claims {
                            session_id: session
                                .get("session_id")
                                .unwrap()
                                .to_string()
                                .trim_matches('"')
                                .to_string(),
                            is_admin: false,
                            exp: session
                                .get("active_period_expires_at")
                                .unwrap()
                                .as_i64()
                                .unwrap(),
                        },
                    );
                    token.unwrap()
                }
                Err(_error) => {
                    return Err((StatusCode::BAD_REQUEST, Json("Secret not found".to_owned())))
                }
            };

            let headers = AppendHeaders([(SET_COOKIE, format!("session={}", token))]);

            Ok((
                headers,
                Json(AuthResponse {
                    user_id: user_id.trim_matches('"').to_string(),
                    session_id: session
                        .get("session_id")
                        .unwrap()
                        .to_string()
                        .trim_matches('"')
                        .to_string(),
                }),
            ))
        } else {
            Err((
                StatusCode::UNAUTHORIZED,
                Json("Passwords do not match".to_string()),
            ))
        }
    } else {
        Err((
            StatusCode::NOT_FOUND,
            Json("User does not exist".to_string()),
        ))
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

pub async fn signup_admin(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<SignupLogin>,
) -> Result<
    (
        AppendHeaders<[(HeaderName, std::string::String); 1]>,
        Json<AuthResponse>,
    ),
    (StatusCode, Json<String>),
> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let response = match create_admin(&db_guard, data.email, data.password) {
        Ok(admin) => {
            let admin_id = admin
                .get("admin_id")
                .unwrap()
                .to_string()
                .trim_matches('"')
                .to_string();
            let session = create_session(&db_guard, admin_id.clone());
            let secret = get_secret(&db_guard);
            let token = match secret {
                Ok(secret) => {
                    let token = encrypt_jwt(
                        secret,
                        Claims {
                            session_id: session
                                .get("session_id")
                                .unwrap()
                                .to_string()
                                .trim_matches('"')
                                .to_string(),
                            is_admin: true,
                            exp: session
                                .get("active_period_expires_at")
                                .unwrap()
                                .as_i64()
                                .unwrap(),
                        },
                    );
                    token.unwrap()
                }
                Err(_error) => {
                    return Err((StatusCode::BAD_REQUEST, Json("Secret not found".to_owned())))
                }
            };

            serde_json::json!(
                {
                    "user_id": admin_id,
                    "session_id": session   .get("session_id")
                    .unwrap()
                    .to_string()
                    .trim_matches('"')
                    .to_string(),
                    "token": token
                }
            )
        }
        Err(error) => return Err((StatusCode::BAD_REQUEST, Json(error))),
    };
    let session_id = response["session_id"]
        .to_string()
        .trim_matches('"')
        .to_string();
    let user_id = response["user_id"]
        .to_string()
        .trim_matches('"')
        .to_string();
    let token = response["token"].to_string().trim_matches('"').to_string();
    let headers = AppendHeaders([(SET_COOKIE, format!("session={}", token))]);
    Ok((
        headers,
        Json(AuthResponse {
            user_id,
            session_id,
        }),
    ))
}

pub async fn signin_admin(
    Extension(db): Extension<Arc<Mutex<Database>>>,
    Json(data): Json<SignupLogin>,
) -> Result<
    (
        AppendHeaders<[(HeaderName, std::string::String); 1]>,
        Json<AuthResponse>,
    ),
    (StatusCode, Json<String>),
> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = db_guard.collection("ezbase_admin").unwrap();

    match coll
        .query(Q.field("email").eq(&data.email), QH.empty())
        .find_one()
    {
        Ok(admin_doc) => {
            let admin = admin_doc.unwrap();
            let stored_pass = admin.get("password").unwrap().to_string();
            let trimmed_pass = stored_pass.trim_matches('"').to_string();
            if hash_verify(data.password, trimmed_pass) {
                let admin_id = admin.get("admin_id").unwrap().to_string();
                let session = create_session(&db_guard, admin_id.clone());
                let session_id = session.get("session_id").unwrap().to_string();
                let secret = get_secret(&db_guard);
                let token = match secret {
                    Ok(secret) => {
                        let token = encrypt_jwt(
                            secret,
                            Claims {
                                session_id: session_id.clone().trim_matches('"').to_string(),
                                is_admin: true,
                                exp: session
                                    .get("active_period_expires_at")
                                    .unwrap()
                                    .as_i64()
                                    .unwrap(),
                            },
                        );
                        token.unwrap()
                    }
                    Err(_error) => {
                        return Err((StatusCode::BAD_REQUEST, Json("Secret not found".to_owned())))
                    }
                };
                let headers = AppendHeaders([(SET_COOKIE, format!("session={}", token))]);

                Ok((
                    headers,
                    Json(AuthResponse {
                        user_id: admin_id.trim_matches('"').to_string(),
                        session_id: session_id.clone().trim_matches('"').to_string(),
                    }),
                ))
            } else {
                Err((
                    StatusCode::UNAUTHORIZED,
                    Json("Passwords do not match".to_string()),
                ))
            }
        }
        Err(_) => Err((
            StatusCode::NOT_FOUND,
            Json("User does not exist".to_string()),
        )),
    }
}

// this function checks if any admin exists in the database
pub async fn check_admin_exists(Extension(db): Extension<Arc<Mutex<Database>>>) -> Json<String> {
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };

    let coll = db_guard.collection("ezbase_admin").unwrap();

    // fetch all the admins
    let admins = match coll.query(Q.empty(), QH.empty()).find() {
        Ok(admins) => admins,
        Err(_) => return Json("false".to_string()),
    };

    // if there are no admins, return false
    if admins.count() == 0 {
        return Json("false".to_string());
    }

    Json("true".to_string())
}
