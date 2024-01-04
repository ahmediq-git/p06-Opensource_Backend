pub mod auth;
pub mod router;
pub mod utils;

pub mod apis {
    pub mod auth;
    pub mod collection;
    pub mod document;
    pub mod logs;
}
pub mod middleware {
    pub mod auth;
    pub mod tracer;
}
