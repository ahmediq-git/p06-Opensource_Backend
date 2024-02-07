use std::sync::MutexGuard;

use data_encoding::BASE64;
use ejdb::query::{Q, QH};
use ejdb::Database;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use rand::distributions::{Distribution, Standard};
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub session_id: String,
    pub is_admin: bool,
    pub exp: i64,
}

pub fn encrypt_jwt(secret: String, claims: Claims) -> Result<String, jsonwebtoken::errors::Error> {
    let header = Header::new(Algorithm::HS256);
    let signature = EncodingKey::from_base64_secret(&secret).unwrap();

    let jwt = encode(&header, &claims, &signature);

    match jwt {
        Ok(jwt) => Ok(jwt),
        Err(err) => Err(err),
    }
}

pub fn decrypt_jwt(secret: &String, token: &String) -> Result<Claims, jsonwebtoken::errors::Error> {
    let signature = DecodingKey::from_base64_secret(secret).unwrap();
    let validation = Validation::new(Algorithm::HS256);

    let claims = decode::<Claims>(token, &signature, &validation);
    match claims {
        Ok(claims) => Ok(claims.claims),
        Err(err) => {
            panic!("Error: {}", err);
        }
    }
}

pub fn generate_secret() -> String {
    let mut rng = rand::thread_rng();
    let secret: Vec<u8> = Standard.sample_iter(&mut rng).take(256).collect();
    BASE64.encode(secret.as_slice())
}

pub fn get_secret(db: &MutexGuard<'_, Database>) -> Result<String, ()> {
    let config = db.get_collection("config").unwrap().unwrap();
    let config_data = config
        .query(Q.field("key").eq("secret"), QH.empty())
        .find_one();
    if let Ok(config_data) = config_data {
        let config_data = config_data.unwrap();
        let secret = config_data.get("value").unwrap();
        return Ok(secret.to_string().trim_matches('"').to_string());
    }

    Err(())
}
