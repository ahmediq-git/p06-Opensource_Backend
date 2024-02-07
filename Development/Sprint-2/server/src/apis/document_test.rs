#[cfg(test)]
mod test_doc_api {
    use axum::http::StatusCode;
    use axum_test::{TestServer, TestServerConfig};
    use ejdb::bson::ordered::OrderedDocument;
    use serde_json::json;

    use crate::{router::get_router, utils::auth::rand_string};

    #[tokio::test]
    pub async fn test_insert_one_doc() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let rand = rand_string(8);
        let email = rand.clone() + "@test.com";
        let __signup_response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": email,
                "password": rand
            }))
            .await;
        let insert_response = server
            .post(&"/insert_doc")
            .json(&json!({
                "collection_name": "Test",
                "field_name": "Test",
                "field_value": "Test"
            }))
            .await;
        let doc_id = insert_response.json::<String>();
        let find_response = server
            .get(format!("/get_doc/Test/{}", doc_id).as_str())
            .await;
        assert_eq!(find_response.status_code(), StatusCode::OK)
    }

    #[tokio::test]
    pub async fn test_insert_one_doc_multifield() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let rand = rand_string(8);
        let email = rand.clone() + "@test.com";
        let _signup_response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": email,
                "password": rand
            }))
            .await;
        let insert_response = server
            .post(&"/insert_doc_multifield")
            .json(&json!({
                "collection_name": "Test",
                "data": {
                    "field_1": "Test",
                    "field_2": "Test"
                }
            }))
            .await;
        let doc_id = insert_response.json::<String>();
        let find_response = server
            .get(format!("/get_doc/Test/{}", doc_id).as_str())
            .await;
        assert_eq!(find_response.status_code(), StatusCode::OK)
    }

    #[tokio::test]
    pub async fn test_insert_many_docs() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let rand = rand_string(8);
        let email = rand.clone() + "@test.com";
        let _signin_response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": email,
                "password": rand
            }))
            .await;
        let insert_response = server
            .post(&"/insert_docs")
            .json(&json!({
                "collection_name": "Test",
                "docs": {
                "0": {
                    "field_1": "Test",
                    "field_2": "Test"
                },
                "1": {
                    "field_1": "Test",
                    "field_2": "Test"
                }
            }
            }))
            .await;
        assert_eq!(insert_response.status_code(), StatusCode::OK)
    }

    #[tokio::test]
    pub async fn test_insert_one_field() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let rand = rand_string(8);
        let email = rand.clone() + "@test.com";
        let _signin_response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": email,
                "password": rand
            }))
            .await;
        let insert_response = server
            .post(&"/insert_doc")
            .json(&json!({
                "collection_name": "Test",
                "field_name": "Test",
                "field_value": "Test"
            }))
            .await;
        let doc_id = insert_response.json::<String>();
        let insert_field_response = server
            .post(&"/insert_field")
            .json(&json!({
                "collection_name": "Test",
                "doc_id": doc_id,
                "field_name": "Test",
                "field_value": "Test"
            }))
            .await;
        assert_eq!(insert_field_response.status_code(), StatusCode::OK)
    }

    #[tokio::test]
    pub async fn test_delete_doc() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let rand = rand_string(8);
        let email = rand.clone() + "@test.com";
        let _signin_response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": email,
                "password": rand
            }))
            .await;
        let insert_response = server
            .post(&"/insert_doc")
            .json(&json!({
                "collection_name": "Test",
                "field_name": "Test",
                "field_value": "Test"
            }))
            .await;
        let doc_id = insert_response.json::<String>();
        let _delete_doc_response = server
            .delete(&"/delete_doc")
            .json(&json!({
                "collection_name": "Test",
                "doc_id": doc_id,
            }))
            .await;
        let find_response = server
            .get(format!("/get_doc/Test/{}", doc_id).as_str())
            .await;
        let returned_doc = find_response.json::<Vec<String>>();
        dbg!(returned_doc.clone());
        assert!(returned_doc.len() == 0)
    }

    #[tokio::test]
    pub async fn test_search_doc_one_field() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let rand = rand_string(8);
        let email = rand.clone() + "@test.com";
        let _signin_response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": email,
                "password": rand
            }))
            .await;
        let insert_response = server
            .post(&"/insert_doc")
            .json(&json!({
                "collection_name": "Test",
                "field_name": "Test",
                "field_value": "Test"
            }))
            .await;
        let _doc_id = insert_response.json::<String>();
        let search_doc_response = server
            .post(&"/search_doc")
            .json(&json!({
                "collection_name": "Test",
                "search_key": "Test",
                "search_value": "Test"
            }))
            .await;
        let returned_docs = search_doc_response.json::<Vec<OrderedDocument>>();
        assert!(returned_docs.len() > 0)
    }
}
