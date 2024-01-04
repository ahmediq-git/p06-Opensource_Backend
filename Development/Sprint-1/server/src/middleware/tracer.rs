use std::sync::{Arc, Mutex};

use axum::{extract::State, http::Request, middleware::Next, response::Response};
use chrono::Utc;
use ejdb::{bson, Database};

pub async fn trace<B>(
    State(db): State<Arc<Mutex<Database>>>,
    request: Request<B>,
    next: Next<B>,
) -> Response {
    let uri = request.uri().to_string();
    let method = request.method().to_string();
    let time = Utc::now().to_string();

    let start_time = Utc::now();

    let response = next.run(request).await;

    let time_taken = Utc::now()
        .signed_duration_since(start_time)
        .num_milliseconds()
        .to_string();
    // no need for inner scope lock drop hack since lock does
    // not cross await threshold
    let db_guard = match db.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            let guard = poisoned.into_inner();
            guard
        }
    };
    let coll = db_guard.collection("request_logs").unwrap();
    let status_code = response.status().to_string();
    let doc = bson! {
        "uri" => uri,
        "method" => method,
        "time" => time,
        "time_taken" => time_taken,
        "status_code" => status_code
    };
    coll.save(&doc).unwrap();

    response
}
