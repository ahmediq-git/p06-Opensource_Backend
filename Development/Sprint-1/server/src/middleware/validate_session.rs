use std::{
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};

use axum::{
    debug_handler,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
    Extension,
};
use ejdb::{
    query::{Q, QH},
    Database,
};

use crate::utils::read_cookie_handler;

// get session id, compare to session id from db
// check if active time left, if yes then continue,
// otherwise error

pub async fn validate<B>(request: Request<B>, next: Next<B>) -> Result<Response, StatusCode> {
    let headers = request.headers().to_owned();
    let session_id = read_cookie_handler(headers.clone(), "session".to_string());
    if session_id != "Error" {
        let db = request
            .extensions()
            .get::<Extension<Arc<Mutex<Database>>>>()
            .unwrap()
            .to_owned();
        let db_guard = match db.lock() {
            Ok(guard) => guard,
            Err(poisoned) => {
                let guard = poisoned.into_inner();
                guard
            }
        };
        let coll = db_guard.collection("user_session").unwrap();
        match coll
            .query(Q.field("session_id").eq(session_id), QH.empty())
            .find_one()
        {
            Ok(session) => {
                let active_time = session
                    .unwrap()
                    .get("active_period_expires_at")
                    .unwrap()
                    .as_f64()
                    .unwrap()
                    .to_bits();
                let current_time = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs();
                if current_time > active_time {
                    Err(StatusCode::UNAUTHORIZED)
                } else {
                    Ok(next.run(request).await)
                }
            }
            Err(_) => Err(StatusCode::UNAUTHORIZED),
        }
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}
