use std::{
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};

use crate::utils::read_cookie_handler;
// use axum::body::BoxBody;
// use axum::{
//     body::{self, Full},
//     debug_handler,
//     http::{Request, StatusCode},
//     middleware::Next,
//     response::IntoResponse,
//     response::Response,
//     BoxError, Extension,
// };
// use bytes::Bytes;
// use ejdb::{
//     query::{Q, QH},
//     Database,
// };
// use futures::future::BoxFuture;
// use http_body::Body as HttpBody;
// use std::convert::Infallible;
// use std::error::Error;
// use std::task::{Context, Poll};
// use tower::Service;
// pub async fn validate<B>(
//     Extension(db): Extension<Arc<Mutex<Database>>>,
//     request: Request<B>,
//     next: Next<B>,
// ) -> Result<Response, Box<dyn Error + Send>> {
//     let headers = request.headers().to_owned();
//     let session_id = read_cookie_handler(headers.clone(), "session".to_string());
//     if session_id != "Error" {
//         let db = db.to_owned();
//         let db_guard = match db.lock() {
//             Ok(guard) => guard,
//             Err(poisoned) => {
//                 let guard = poisoned.into_inner();
//                 guard
//             }
//         };
//         let coll = db_guard.collection("user_session").unwrap();
//         match coll
//             .query(Q.field("session_id").eq(session_id), QH.empty())
//             .find_one()
//         {
//             Ok(session) => {
//                 let active_time = session
//                     .unwrap()
//                     .get("active_period_expires_at")
//                     .unwrap()
//                     .as_f64()
//                     .unwrap()
//                     .to_bits();
//                 let current_time = SystemTime::now()
//                     .duration_since(UNIX_EPOCH)
//                     .unwrap()
//                     .as_secs();
//                 if current_time > active_time {
//                     return Err(Box::new(std::fmt::Error {}));
//                 } else {
//                     Ok(next.run(request).await)
//                 }
//             }
//             _ => Err(Box::new(std::fmt::Error {})),
//         }
//     } else {
//         return Err(Box::new(std::fmt::Error {}));
//     }
// }

// get session id, compare to session id from db
// check if active time left, if yes then continue,
// otherwise error
// #[derive(Clone)]
// pub struct ValidateSession<S> {
//     db: Arc<Mutex<Database>>,
//     inner: S,
// }

// impl<S> ValidateSession<S> {
//     pub fn new(db: Arc<Mutex<Database>>, inner: S) -> Self {
//         Self { db, inner }
//     }
// }

// impl<S, ReqBody> Service<Request<ReqBody>> for ValidateSession<S>
// where
//     S: Service<Request<ReqBody>, Response = Response<BoxBody>, Error = Infallible>
//         + Clone
//         + Send
//         + 'static,
//     S::Future: Send + 'static,
//     ReqBody: HttpBody<Data = Bytes> + Send + 'static,
//     ReqBody::Error: Into<BoxError>,
// {
//     type Response = S::Response;
//     type Error = Infallible;
//     type Future = BoxFuture<'static, Result<Self::Response, Self::Error>>;

//     fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
//         self.inner.poll_ready(cx)
//     }

//     fn call(&mut self, request: Request<ReqBody>) -> Self::Future {
//         let cloned_db = self.db.clone();
//         let mut inner = self.inner.clone();

//         Box::pin(async move {
//             let headers = request.headers().to_owned();
//             let session_id = read_cookie_handler(headers.clone(), "session".to_string());
//             if session_id != "Error" {
//                 let db = cloned_db;
//                 let db_guard = match db.lock() {
//                     Ok(guard) => guard,
//                     Err(poisoned) => {
//                         let guard = poisoned.into_inner();
//                         guard
//                     }
//                 };
//                 let coll = db_guard.collection("user_session").unwrap();
//                 match coll
//                     .query(Q.field("session_id").eq(session_id), QH.empty())
//                     .find_one()
//                 {
//                     Ok(session) => {
//                         let active_time = session
//                             .unwrap()
//                             .get("active_period_expires_at")
//                             .unwrap()
//                             .as_f64()
//                             .unwrap()
//                             .to_bits();
//                         let current_time = SystemTime::now()
//                             .duration_since(UNIX_EPOCH)
//                             .unwrap()
//                             .as_secs();
//                         if current_time > active_time {
//                             let response = Response::builder()
//                                 .status(StatusCode::UNAUTHORIZED)
//                                 .body(body::boxed(Full::from("Unauthorized")))
//                                 .unwrap();
//                             Ok(response)
//                         } else {
//                             let res = match inner.call(request).await {
//                                 Ok(response) => Ok(response),
//                                 Err(e) => Ok(Response::builder()
//                                     .status(StatusCode::INTERNAL_SERVER_ERROR)
//                                     .body(body::boxed(Full::from("Internal Server Error")))
//                                     .unwrap()),
//                             };
//                             res
//                         }
//                     }
//                     Err(_) => {
//                         let response = Response::builder()
//                             .status(StatusCode::UNAUTHORIZED)
//                             .body(body::boxed(Full::from("Unauthorized")))
//                             .unwrap();
//                         Ok(response)
//                     }
//                 }
//             } else {
//                 let response = Response::builder()
//                     .status(StatusCode::UNAUTHORIZED)
//                     .body(body::boxed(Full::from("Unauthorized")))
//                     .unwrap();
//                 Ok(response)
//             }

//             // inner.call(request).await

//             // If session is invalid, create and return an unauthorized response
//             // Similar to the one above
//         })
//     }
// }

// impl<S> ValidateSession<S> {
//     pub fn new(db: Arc<Mutex<Database>>, inner: S) -> Self {
//         Self { db, inner }
//     }
// }

// impl<S, Request> Service<Request> for ValidateSession<S>
// where
//     S: Service<Request, Response = Response, Error = Infallible> + Clone,
// {
//     type Response = S::Response;
//     type Error = Infallible;
//     type Future = BoxFuture<'static, Result<Self::Response, Self::Error>>;

//     fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
//         self.inner.poll_ready(cx)
//     }

//     fn call(&mut self, mut request: Request) -> Self::Future {
//         Box::pin(async move {
//             let headers = request.headers().to_owned();
//             let session_id = read_cookie_handler(headers.clone(), "session".to_string());
//             if session_id != "Error" {
//                 let db = request
//                     .extensions()
//                     .get::<Extension<Arc<Mutex<Database>>>>()
//                     .unwrap()
//                     .to_owned();
//                 let db_guard = match db.lock() {
//                     Ok(guard) => guard,
//                     Err(poisoned) => {
//                         let guard = poisoned.into_inner();
//                         guard
//                     }
//                 };
//                 let coll = db_guard.collection("user_session").unwrap();
//                 match coll
//                     .query(Q.field("session_id").eq(session_id), QH.empty())
//                     .find_one()
//                 {
//                     Ok(session) => {
//                         let active_time = session
//                             .unwrap()
//                             .get("active_period_expires_at")
//                             .unwrap()
//                             .as_f64()
//                             .unwrap()
//                             .to_bits();
//                         let current_time = SystemTime::now()
//                             .duration_since(UNIX_EPOCH)
//                             .unwrap()
//                             .as_secs();
//                         if current_time > active_time {
//                             Err(StatusCode::UNAUTHORIZED)
//                         } else {
//                             Ok(next.run(request).await)
//                         }
//                     }
//                     Err(_) => Err(StatusCode::UNAUTHORIZED),
//                 }
//             } else {
//                 Err(StatusCode::UNAUTHORIZED)
//             }
//         })
//     }
// }
// pub async fn validate<B>(request: Request<B>, next: Next<B>) -> Result<Response, StatusCode> {
//     let headers = request.headers().to_owned();
//     let session_id = read_cookie_handler(headers.clone(), "session".to_string());
//     if session_id != "Error" {
//         let db = request
//             .extensions()
//             .get::<Extension<Arc<Mutex<Database>>>>()
//             .unwrap()
//             .to_owned();
//         let db_guard = match db.lock() {
//             Ok(guard) => guard,
//             Err(poisoned) => {
//                 let guard = poisoned.into_inner();
//                 guard
//             }
//         };
//         let coll = db_guard.collection("user_session").unwrap();
//         match coll
//             .query(Q.field("session_id").eq(session_id), QH.empty())
//             .find_one()
//         {
//             Ok(session) => {
//                 let active_time = session
//                     .unwrap()
//                     .get("active_period_expires_at")
//                     .unwrap()
//                     .as_f64()
//                     .unwrap()
//                     .to_bits();
//                 let current_time = SystemTime::now()
//                     .duration_since(UNIX_EPOCH)
//                     .unwrap()
//                     .as_secs();
//                 if current_time > active_time {
//                     Err(StatusCode::UNAUTHORIZED)
//                 } else {
//                     Ok(next.run(request).await)
//                 }
//             }
//             Err(_) => Err(StatusCode::UNAUTHORIZED),
//         }
//     } else {
//         Err(StatusCode::UNAUTHORIZED)
//     }
// }
// pub async fn validate<B, S>(request: Request<B>, next: Next<B>) -> Result<Response, Infallible>
// where
//     S: Service<Request<Body>, Response = Response<Body>, Error = Infallible>
//         + Clone
//         + Send
//         + 'static,
//     S::Future: Send,
// {
//     let headers = request.headers().to_owned();
//     let session_id = read_cookie_handler(headers.clone(), "session".to_string());
//     if session_id != "Error" {
//         let db = request
//             .extensions()
//             .get::<Extension<Arc<Mutex<Database>>>>()
//             .unwrap()
//             .to_owned();
//         let db_guard = match db.lock() {
//             Ok(guard) => guard,
//             Err(poisoned) => {
//                 let guard = poisoned.into_inner();
//                 guard
//             }
//         };
//         let coll = db_guard.collection("user_session").unwrap();
//         match coll
//             .query(Q.field("session_id").eq(session_id), QH.empty())
//             .find_one()
//         {
//             Ok(session) => {
//                 let active_time = session
//                     .unwrap()
//                     .get("active_period_expires_at")
//                     .unwrap()
//                     .as_f64()
//                     .unwrap()
//                     .to_bits();
//                 let current_time = SystemTime::now()
//                     .duration_since(UNIX_EPOCH)
//                     .unwrap()
//                     .as_secs();
//                 if current_time > active_time {
//                     let response =
//                         (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response();
//                     Ok(response)
//                 } else {
//                     drop(db_guard);
//                     Ok(next.run(request).await)
//                 }
//             }
//             Err(_) => {
//                 let response = (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response();
//                 Ok(response)
//             }
//         }
//     } else {
//         let response = (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response();
//         Ok(response)
//     }
// }
// pub async fn validate<B>(
//     request: Request<B>,
//     next: Next<B>,
// ) -> Result<Response, std::convert::Infallible> {
//     let headers = request.headers().to_owned();
//     let session_id = read_cookie_handler(headers.clone(), "session".to_string());
//     if session_id != "Error" {
//         let db = request
//             .extensions()
//             .get::<Extension<Arc<Mutex<Database>>>>()
//             .unwrap()
//             .to_owned();
//         let db_guard = match db.lock() {
//             Ok(guard) => guard,
//             Err(poisoned) => {
//                 let guard = poisoned.into_inner();
//                 guard
//             }
//         };
//         let coll = db_guard.collection("user_session").unwrap();
//         match coll
//             .query(Q.field("session_id").eq(session_id), QH.empty())
//             .find_one()
//         {
//             Ok(session) => {
//                 let active_time = session
//                     .unwrap()
//                     .get("active_period_expires_at")
//                     .unwrap()
//                     .as_f64()
//                     .unwrap()
//                     .to_bits();
//                 let current_time = SystemTime::now()
//                     .duration_since(UNIX_EPOCH)
//                     .unwrap()
//                     .as_secs();
//                 if current_time > active_time {
//                     let response =
//                         (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response();
//                     Ok(response)
//                 } else {
//                     drop(db_guard);
//                     Ok(next.run(request).await)
//                 }
//             }
//             Err(_) => {
//                 let response = (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response();
//                 Ok(response)
//             }
//         }
//     } else {
//         let response = (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response();
//         Ok(response)
//     }
// }

// pub async fn validate<S>(request: Request<Body>, mut next: S) -> Result<Response<Body>, Infallible>
// where
//     S: Service<Request<Body>, Response = Response<Body>, Error = Infallible>
//         + Clone
//         + Send
//         + 'static,
//     S::Future: Send,
// {
//     let headers = request.headers().to_owned();
//     let session_id = read_cookie_handler(headers.clone(), "session".to_string());
//     if session_id != "Error" {
//         let db = request
//             .extensions()
//             .get::<Extension<Arc<Mutex<Database>>>>()
//             .unwrap()
//             .to_owned();
//         let db_guard = match db.lock() {
//             Ok(guard) => guard,
//             Err(poisoned) => {
//                 let guard = poisoned.into_inner();
//                 guard
//             }
//         };
//         let coll = db_guard.collection("user_session").unwrap();
//         match coll
//             .query(Q.field("session_id").eq(session_id), QH.empty())
//             .find_one()
//         {
//             Ok(session) => {
//                 let active_time = session
//                     .unwrap()
//                     .get("active_period_expires_at")
//                     .unwrap()
//                     .as_f64()
//                     .unwrap()
//                     .to_bits();
//                 let current_time = SystemTime::now()
//                     .duration_since(UNIX_EPOCH)
//                     .unwrap()
//                     .as_secs();
//                 if current_time > active_time {
//                     Ok(Response::builder()
//                         .status(StatusCode::UNAUTHORIZED)
//                         .body(Body::empty())
//                         .unwrap())
//                 } else {
//                     next.call(request).await
//                 }
//             }
//             Err(_) => Ok(Response::builder()
//                 .status(StatusCode::UNAUTHORIZED)
//                 .body(Body::empty())
//                 .unwrap()),
//         }
//     } else {
//         Ok(Response::builder()
//             .status(StatusCode::UNAUTHORIZED)
//             .body(Body::empty())
//             .unwrap())
//     }
// }
