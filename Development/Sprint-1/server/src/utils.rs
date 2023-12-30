use std::collections::HashMap;

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
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

pub fn hasher(input: String) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(input.as_bytes(), &salt)
        .unwrap()
        .to_string();
    password_hash
}

pub fn hash_verify(input: String, to_match: String) -> bool {
    let parsed_hash = PasswordHash::new(&to_match).unwrap();
    match Argon2::default().verify_password(input.as_bytes(), &parsed_hash) {
        Ok(_) => return true,
        Err(_) => return false,
    }
}
