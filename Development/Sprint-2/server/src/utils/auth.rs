use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use axum::http::{header::COOKIE, HeaderMap};
use random_string::generate;
use regex::Regex;
use std::collections::HashMap;

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

pub fn validate_credentials(email: &str, password: &str) -> Result<(), String> {
    // Validate the email
    let email_re = Regex::new(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$").unwrap();
    if !email_re.is_match(&email) {
        return Err("Invalid email.".to_string());
    }

    // Validate the password length
    if password.len() < 8 {
        return Err("Password must be at least 8 characters.".to_string());
    }

    Ok(())
}

pub fn create_cookie_header(
    session_id: String,
    path: &str,
    secure: bool,
    samesite: &str,
    maxage: i32,
    http_only: bool,
) -> String {
    let mut header = String::from("session=");

    header.push_str(&session_id);

    if path != "" {
        header.push_str("; Path=");
        header.push_str(path);
    }

    if secure {
        header.push_str("; Secure");
    }

    if http_only {
        header.push_str("; HttpOnly");
    }

    header.push_str("; SameSite=");
    header.push_str(samesite);

    header.push_str("; Max-Age=");
    header.push_str(&maxage.to_string());

    header
}
