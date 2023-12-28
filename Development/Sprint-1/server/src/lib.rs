pub mod auth;
pub mod router;
pub mod utils;

pub mod apis {
    pub mod auth;
    pub mod collection;
    pub mod document;
}

pub mod middleware {
    pub mod validate_session;
}
