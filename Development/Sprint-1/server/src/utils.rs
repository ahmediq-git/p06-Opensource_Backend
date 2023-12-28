use std::collections::HashMap;

use axum::http::{header::COOKIE, HeaderMap};
use random_string::generate;

pub fn rand_string(len: usize) -> String {
    let charset = "1234567890abcdefghijklmnopqrstuvwxyz";
    generate(len, charset)
}

pub fn read_cookie_handler(headers: HeaderMap, cookie_name: String) -> String {
    if let Some(cookie_header) = headers.get(COOKIE) {
        let cookies = parse_cookies(cookie_header.to_str().unwrap());
        if let Some(val) = cookies.get(&cookie_name) {
            return format!("{}", val);
        }
    }
    "Error".to_string()
}

pub fn parse_cookies(cookie_header: &str) -> HashMap<String, String> {
    cookie_header
        .split(';')
        .filter_map(|cookie| {
            let mut parts = cookie.trim().split('=');
            let name = parts.next()?.to_string();
            let value = parts.next()?.to_string();
            Some((name, value))
        })
        .collect()
}
