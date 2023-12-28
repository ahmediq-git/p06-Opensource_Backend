use std::sync::{Arc, Mutex, MutexGuard};

use crate::utils::rand_string;
use chrono::Utc;
use ejdb::{
    bson,
    bson::ordered::OrderedDocument,
    query::{Q, QH},
    Database,
};

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
        let key = bson! {
            "user_id" => user_id,
            "provider_id" => provider_id,
            "provider_userid" => provider_userid,
            "password" => (opt password)
        };
        coll.save(&key).unwrap();
        Ok(key)
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
        Ok(key) => {
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
    let active_expiry = Utc::now().timestamp() + 86400;
    let session = bson! {
       "session_id" => session_id,
       "user_id" => trimmed_id,
       "state" => "active",
       "active_period_expires_at" => active_expiry
    };
    coll.save(&session).unwrap();
    session
}
