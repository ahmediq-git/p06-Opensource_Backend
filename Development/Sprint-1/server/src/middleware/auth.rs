use std::sync::{Arc, Mutex};

use crate::utils::auth::read_cookie_handler;
use crate::utils::jwt::{decrypt_jwt, get_secret, Claims};
use axum::{
    extract::State,
    http::{HeaderMap, Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};
use chrono::Utc;
use ejdb::{
    query::{Q, QH},
    Database,
};

const SESSION_TIME: i64 = 60;

pub async fn auth_validate<B>(
    State(db): State<Arc<Mutex<Database>>>,
    headers: HeaderMap,
    request: Request<B>,
    next: Next<B>,
) -> Response {
    let token = read_cookie_handler(headers.clone(), "session".to_string());
    let trimmed_token = token.trim_matches('"').to_string();
    let mut response_result = Ok(());

    if token != "Error" {
        let db_guard = db.lock().unwrap_or_else(|poisoned| poisoned.into_inner());
        let secret = get_secret(&db_guard).unwrap();
        let claims: Claims = decrypt_jwt(&secret, &trimmed_token).unwrap();
        let trimmed_session_id = claims.session_id.trim_matches('"').to_string();

        let coll = db_guard.collection("user_session").unwrap();
        match coll
            .query(Q.field("session_id").eq(&trimmed_session_id), QH.empty())
            .find_one()
        {
            Ok(Some(doc)) => {
                let active_time = doc
                    .get("active_period_expires_at")
                    .unwrap()
                    .as_i64()
                    .unwrap();
                let current_time = Utc::now().timestamp();
                if current_time > active_time {
                    response_result = Err(StatusCode::UNAUTHORIZED);
                } else {
                    let new_time = current_time + SESSION_TIME;
                    if coll
                        .query(
                            Q.field("session_id")
                                .eq(&trimmed_session_id)
                                .set("active_period_expires_at", new_time),
                            QH.empty(),
                        )
                        .update()
                        .is_err()
                    {
                        response_result = Err(StatusCode::UNAUTHORIZED);
                    }
                }
            }
            Ok(None) => response_result = Err(StatusCode::UNAUTHORIZED),
            Err(_) => response_result = Err(StatusCode::UNAUTHORIZED),
        };
    } else {
        response_result = Err(StatusCode::UNAUTHORIZED);
    };

    match response_result {
        Ok(_) => next.run(request).await,
        Err(status) => status.into_response(),
    }
}
