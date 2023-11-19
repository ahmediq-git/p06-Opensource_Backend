use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use ejdb::Database;
use serde::de::value::Error as DeserializationError;
use std::sync::{Mutex, PoisonError};
use thiserror::Error;
#[derive(Error, Debug)]
pub enum CustomError {
    #[error("Failed to lock the database")]
    LockError(#[from] PoisonError<Mutex<Database>>),
    #[error("Failed to deserialize JSON")]
    DeserializationError(#[from] DeserializationError),
    #[error("Database operation failed")]
    DBError(#[from] ejdb::Error),
    // Add more error types as needed
}

impl IntoResponse for CustomError {
    fn into_response(self) -> Response {
        match self {
            CustomError::LockError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Database lock failed").into_response()
            }
            CustomError::DeserializationError(_) => {
                (StatusCode::BAD_REQUEST, "Invalid JSON format").into_response()
            }
            CustomError::DBError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Database operation failed",
            )
                .into_response(),
        }
    }
}
