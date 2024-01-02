use std::sync::{Arc, Mutex};

use axum::{extract::State, http::Request, middleware::Next, response::Response};
use chrono::Utc;
use ejdb::{bson, Database};

pub async fn trace<B>(
    State(db): State<Arc<Mutex<Database>>>,
    request: Request<B>,
    next: Next<B>,
) -> Response {
    // The reason for introducing an inner scope here is so that
    // the lock on the db is automatically dropped before the next
    // function, otherwise the lock would get stuck. drop(db_guard)
    // should work as well but apparently it performs differently
    // due to a rust bug
    {
        let db_guard = match db.lock() {
            Ok(guard) => guard,
            Err(poisoned) => {
                let guard = poisoned.into_inner();
                guard
            }
        };
        let coll = db_guard.collection("request_logs").unwrap();
        let uri = request.uri().to_string();
        let method = request.method().to_string();
        let time = Utc::now().to_string();
        let doc = bson! {
            "uri" => uri,
            "method" => method,
            "time" => time
        };
        coll.save(&doc).unwrap();
    }
    let response = next.run(request).await;
    response
}
