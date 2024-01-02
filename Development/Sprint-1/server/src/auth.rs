use std::{
    sync::{Arc, Mutex, MutexGuard},
    time::{SystemTime, UNIX_EPOCH},
};

use crate::utils::{hasher, rand_string, read_cookie_handler};
use axum::http::{HeaderMap, StatusCode};
use chrono::Utc;
use ejdb::{
    bson,
    bson::ordered::OrderedDocument,
    query::{Q, QH},
    Database,
};

const SESSION_TIME: i64 = 60;

pub fn create_key(
    db: &MutexGuard<'_, Database>,
    user_id: String,
    provider_id: String,
    provider_userid: String,
    password: Option<String>,
) -> Result<OrderedDocument, String> {
    // let key = Key {
    //     user_id:
    //     provider_id,
    //     provider_userid,
    //     password,
    // };
    let coll = db.collection("user_key").unwrap();
    let existing_count = coll
        .query(Q.field("provider_userid").eq(&provider_userid), QH.empty())
        .count()
        .unwrap();
    if existing_count > 0 {
        Err("User already exists".to_string())
    } else {
        match password {
            Some(password) => {
                let hashed_pass = hasher(password);
                let key = bson! {
                    "user_id" => user_id,
                    "provider_id" => provider_id,
                    "provider_userid" => provider_userid,
                    "password" => (hashed_pass)
                };
                coll.save(&key).unwrap();
                Ok(key)
            }
            None => {
                let key = bson! {
                    "user_id" => user_id,
                    "provider_id" => provider_id,
                    "provider_userid" => provider_userid
                };
                coll.save(&key).unwrap();
                Ok(key)
            }
        }
    }
}

pub fn create_user(
    db: &MutexGuard<'_, Database>,
    provider_id: String,
    provider_userid: String,
    password: Option<String>,
) -> Result<OrderedDocument, String> {
    // let user = User {
    //     user_id
    // }

    let coll = db.collection("user").unwrap();
    let user_id = rand_string(15);
    let user = match create_key(db, user_id.clone(), provider_id, provider_userid, password) {
        Ok(_key) => {
            let user = bson! {
                "user_id" => user_id
            };
            coll.save(&user).unwrap();
            user
        }
        Err(error) => return Err(error),
    };
    Ok(user)
}

pub fn create_session(db: &MutexGuard<'_, Database>, user_id: String) -> OrderedDocument {
    // let session = Session{
    //     session_id,
    //     user_id,
    //     state,
    //     active_period_expires_at,
    // }
    let trimmed_id = user_id.trim_matches('"').to_string(); // user id has extra double quotes that, cant figure out why

    let coll = db.collection("user_session").unwrap();
    let session_id = rand_string(40);
    let active_expiry = Utc::now().timestamp() + SESSION_TIME;
    let session = bson! {
       "session_id" => session_id,
       "user_id" => trimmed_id,
       "state" => "active",
       "active_period_expires_at" => active_expiry
    };
    coll.save(&session).unwrap();
    session
}

// get session id, compare to session id from db
// check if active time left, if yes then continue,
// otherwise error
pub fn validate_session(
    db: &MutexGuard<'_, Database>,
    headers: HeaderMap,
) -> Result<StatusCode, StatusCode> {
    let session_id = read_cookie_handler(headers.clone(), "session".to_string());
    let trimmed_session_id = session_id.trim_matches('"').to_string();
    if session_id != "Error" {
        let coll = db.collection("user_session").unwrap();
        match coll
            .query(Q.field("session_id").eq(&trimmed_session_id), QH.empty())
            .find_one()
        {
            Ok(session) => match session {
                Some(doc) => {
                    let active_time = doc
                        .get("active_period_expires_at")
                        .unwrap()
                        .as_i64()
                        .unwrap();

                    let current_time = Utc::now().timestamp();
                    if current_time > active_time {
                        Err(StatusCode::UNAUTHORIZED)
                    } else {
                        let new_time = current_time + SESSION_TIME;
                        match coll
                            .query(
                                Q.field("session_id")
                                    .eq(&trimmed_session_id)
                                    .set("active_period_expires_at", new_time),
                                QH.empty(),
                            )
                            .update()
                        {
                            Ok(_) => Ok(StatusCode::OK),
                            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
                        }
                    }
                }
                None => return Err(StatusCode::INTERNAL_SERVER_ERROR),
            },
            Err(_) => Err(StatusCode::UNAUTHORIZED),
        }
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}

pub fn delete_session(
    db: &MutexGuard<'_, Database>,
    headers: HeaderMap,
) -> Result<StatusCode, StatusCode> {
    let session_id = read_cookie_handler(headers.clone(), "session".to_string());
    let trimmed_session_id = session_id.trim_matches('"').to_string();
    if session_id != "Error" {
        let coll = db.collection("user_session").unwrap();
        let q = Q.field("session_id").eq(trimmed_session_id).drop_all();
        match coll.query(q, QH.empty()).update() {
            Ok(_) => return Ok(StatusCode::OK),
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
        }
    } else {
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
